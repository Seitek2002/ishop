/**
 * Returns true if now is outside of working hours defined by schedule string "HH:MM-HH:MM".
 * Handles overnight schedules like "20:00-04:00" (crossing midnight) and 24/7 "00:00-00:00".
 */
export function isOutsideWorkTime(schedule: string, now: Date = new Date()): boolean {
  if (!schedule || !schedule.includes('-')) return false; // fail-open if invalid

  const [startTimeStr, endTimeStr] = schedule.split('-').map((s) => s.trim());
  const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
  const [endHours, endMinutes] = endTimeStr.split(':').map(Number);

  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();

  const toMinutes = (h: number, m: number) => h * 60 + m;

  const startTotal = toMinutes(startHours, startMinutes);
  const endTotal = toMinutes(endHours, endMinutes);
  const nowTotal = toMinutes(nowHours, nowMinutes);

  // 24/7 case (start == end)
  if (startTotal === endTotal) {
    return false;
  }

  // Normal same-day window
  if (startTotal < endTotal) {
    return !(nowTotal >= startTotal && nowTotal < endTotal);
  }

  // Overnight window (e.g. 20:00-04:00)
  // Open if now >= start OR now < end
  return !(nowTotal >= startTotal || nowTotal < endTotal);
}

/**
 * Derive today's schedule window from optional weekly schedules; falls back to a single schedule string.
 * Returns:
 *  - window: "HH:MM-HH:MM" to reuse in isOutsideWorkTime
 *  - isClosed: true when today is day-off according to schedules
 */
export function getTodayScheduleWindow(
  schedules?: Array<{ dayOfWeek: number; workStart: string; workEnd: string; isDayOff?: boolean }>,
  fallbackSchedule?: string
): { window: string; isClosed: boolean } {
  const today = new Date();
  // JS: 0=Sun..6=Sat; API: 1=Mon..7=Sun
  const apiDay = ((today.getDay() + 6) % 7) + 1; // convert 0..6 => 1..7
  if (schedules && schedules.length) {
    const item = schedules.find((s) => s.dayOfWeek === apiDay) ?? schedules[0];
    if (item) {
      const start = (item.workStart || '').slice(0, 5);
      const end = (item.workEnd || '').slice(0, 5);
      const isClosed = !!item.isDayOff;
      const window = `${start || '00:00'}-${end || '00:00'}`;
      return { window, isClosed };
    }
  }
  return { window: (fallbackSchedule && fallbackSchedule.includes('-') ? fallbackSchedule : '00:00-00:00'), isClosed: false };
}

/**
 * Human-friendly text for today's schedule. If day off -> localized or plain "Выходной".
 */
export function getTodayScheduleText(
  schedules?: Array<{ dayOfWeek: number; dayName?: string; workStart: string; workEnd: string; isDayOff?: boolean }>,
  fallbackSchedule?: string,
  localeDayOffText: string = 'Выходной'
): string {
  const { window, isClosed } = getTodayScheduleWindow(schedules, fallbackSchedule);
  if (isClosed) return localeDayOffText;
  return window;
}

/**
 * Local RU names for days by API day index (1..7 => Mon..Sun)
 */
const DAY_NAMES_RU = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

function getRuDayName(apiDay: number): string {
  const idx = ((apiDay - 1) % 7 + 7) % 7;
  return DAY_NAMES_RU[idx] ?? '';
}

/**
 * Returns detailed info for today's schedule including a localized day name.
 * - dayName: taken from schedules[i].dayName if provided, otherwise RU fallback
 * - window: "HH:MM-HH:MM" (or fallbackSchedule if weekly is absent)
 * - isClosed: true if today is day-off
 * - text: isClosed ? localeDayOffText : window
 */
export function getTodayScheduleInfo(
  schedules?: Array<{ dayOfWeek: number; dayName?: string; workStart: string; workEnd: string; isDayOff?: boolean }>,
  fallbackSchedule?: string,
  localeDayOffText: string = 'Выходной'
): { dayName: string; window: string; isClosed: boolean; text: string } {
  const today = new Date();
  const apiDay = ((today.getDay() + 6) % 7) + 1; // 1..7

  let dayName = getRuDayName(apiDay);
  let window = '00:00-00:00';
  let isClosed = false;

  if (schedules && schedules.length) {
    const item = schedules.find((s) => s.dayOfWeek === apiDay) ?? schedules[0];
    if (item) {
      dayName = item.dayName || getRuDayName(item.dayOfWeek);
      const start = (item.workStart || '').slice(0, 5);
      const end = (item.workEnd || '').slice(0, 5);
      isClosed = !!item.isDayOff;
      window = `${start || '00:00'}-${end || '00:00'}`;
    }
  } else {
    window = fallbackSchedule && fallbackSchedule.includes('-') ? fallbackSchedule : '00:00-00:00';
  }

  const text = isClosed ? localeDayOffText : window;
  return { dayName, window, isClosed, text };
}
