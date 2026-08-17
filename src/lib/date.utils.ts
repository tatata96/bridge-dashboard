// Returns a new date offset by the given number of days (negative to go back).
export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// Returns a new date offset by the given number of months.
export function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

// Returns a new date offset by the given number of minutes.
export function addMinutes(date: Date, minutes: number) {
  const next = new Date(date);
  const safeMinutes = Number.isFinite(minutes) ? minutes : 0;
  next.setMinutes(next.getMinutes() + safeMinutes);
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

// Formats a date as "Thu, 15 Jun 2026".
export function formatShortDateWithYear(date: Date, locale = "en-US") {
  const parts = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("weekday")}, ${getPart("day")} ${getPart("month")} ${getPart(
    "year",
  )}`;
}

// Formats a date's time as "7:00 AM".
export function formatTime(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

// Formats a time range as "7:00-8:00 AM".
export function formatTimeRange(start: Date, end: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).formatRange(start, end);
}

// Returns today's date with the time from an "HH:mm" value.
export function dateFromTimeString(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date;
}

// Returns a local Date from a "YYYY-MM-DD" value.
export function dateFromYmdString(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
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

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
