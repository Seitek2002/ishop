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
  return !(
    nowTotal >= startTotal ||
    nowTotal < endTotal
  );
}
