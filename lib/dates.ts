function toLocalISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toLocalISO(new Date());
}

// Returns the Monday of the week containing `date` as YYYY-MM-DD.
// The spec defines week start as Monday (day 1).
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday … 6 = Saturday
  const distToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + distToMonday);
  return toLocalISO(d);
}

// Days from `from` until the next occurrence of `targetDay` (0 = Sunday).
// Returns 0 when `from` is already on that day.
export function daysUntil(
  targetDay: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  from: Date = new Date()
): number {
  return (targetDay - from.getDay() + 7) % 7;
}

// True when `weekStartISO` is the Monday of the same week as `from`.
export function isSameWeek(
  weekStartISO: string,
  from: Date = new Date()
): boolean {
  return getWeekStart(from) === weekStartISO;
}
