import type { TranslationKey } from "@/i18n/i18n";
import type { ClassStatus, Weekday } from "@/types/classes";

export const classStatusLabelKeys = {
  active: "classes.active",
  paused: "classes.paused",
} satisfies Record<ClassStatus, TranslationKey>;

export const weekdays: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const weekdayIndexes = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} satisfies Record<Weekday, number>;

export const weekdayShortLabelKeys = {
  monday: "weekday.short.monday",
  tuesday: "weekday.short.tuesday",
  wednesday: "weekday.short.wednesday",
  thursday: "weekday.short.thursday",
  friday: "weekday.short.friday",
  saturday: "weekday.short.saturday",
  sunday: "weekday.short.sunday",
} satisfies Record<Weekday, TranslationKey>;

export const weekdayLongLabelKeys = {
  monday: "weekday.long.monday",
  tuesday: "weekday.long.tuesday",
  wednesday: "weekday.long.wednesday",
  thursday: "weekday.long.thursday",
  friday: "weekday.long.friday",
  saturday: "weekday.long.saturday",
  sunday: "weekday.long.sunday",
} satisfies Record<Weekday, TranslationKey>;
