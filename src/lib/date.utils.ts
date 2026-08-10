// Returns a new date offset by the given number of days (negative to go back).
export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// Formats a date as "Thu, Jun 15".
export function formatShortDate(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Formats a date's time as "7:00 AM".
export function formatTime(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

// Returns a new date with the same day as `date` but the given hours/minutes.
export function atTime(date: Date, hours: number, minutes: number) {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

// Whether two dates fall on the same calendar day (ignores time of day).
export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
