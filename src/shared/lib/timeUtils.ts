import type { WorkSchedule } from '@/shared/api/types';

/**
 * Возвращает true, если сейчас нерабочее время (формат "HH:MM-HH:MM").
 * Поддерживает ночные смены (напр. "20:00-04:00") и круглосуточную работу "00:00-00:00".
 */
export function isOutsideWorkTime(
  schedule: string,
  now: Date = new Date(),
): boolean {
  if (!schedule || !schedule.includes('-')) return false;

  const [startTimeStr, endTimeStr] = schedule.split('-').map((s) => s.trim());
  const [startHours, startMinutes] = (startTimeStr || '00:00')
    .split(':')
    .map(Number);
  const [endHours, endMinutes] = (endTimeStr || '00:00').split(':').map(Number);

  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();

  const toMinutes = (h: number, m: number) =>
    (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);

  const startTotal = toMinutes(startHours, startMinutes);
  const endTotal = toMinutes(endHours, endMinutes);
  const nowTotal = toMinutes(nowHours, nowMinutes);

  // Круглосуточно
  if (startTotal === endTotal) {
    return false;
  }

  // Обычный рабочий день (например, 10:00 - 22:00)
  if (startTotal < endTotal) {
    return !(nowTotal >= startTotal && nowTotal < endTotal);
  }

  // Ночная смена, переход через полночь (например, 20:00 - 04:00)
  return !(nowTotal >= startTotal || nowTotal < endTotal);
}

/**
 * Получает график работы на сегодня из массива расписаний.
 * Возвращает строку окна "HH:MM-HH:MM" и флаг закрытия.
 */
export function getTodayScheduleWindow(
  schedules?: WorkSchedule[] | null,
  fallbackSchedule?: string,
): { window: string; isClosed: boolean } {
  const today = new Date();
  // Переводим дни из JS (0=Вс..6=Сб) в формат API (1=Пн..7=Вс)
  const apiDay = ((today.getDay() + 6) % 7) + 1;

  if (Array.isArray(schedules) && schedules.length > 0) {
    const item = schedules.find((s) => s.dayOfWeek === apiDay);

    if (item) {
      if (item.is24h) return { window: '00:00-00:00', isClosed: false };
      if (item.isDayOff) return { window: '00:00-00:00', isClosed: true };

      const start = (item.workStart || '00:00').slice(0, 5);
      const end = (item.workEnd || '00:00').slice(0, 5);
      return { window: `${start}-${end}`, isClosed: false };
    }
  }

  // Если на сегодня нет расписания в массиве, используем запасную строку
  const window =
    fallbackSchedule && fallbackSchedule.includes('-')
      ? fallbackSchedule
      : '00:00-00:00';
  return { window, isClosed: false };
}
