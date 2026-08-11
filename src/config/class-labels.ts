import type { TranslationKey } from "@/i18n/i18n";
import type { ClassStatus, Weekday } from "@/types/classes";

export const classStatusLabelKeys = {
  active: "classes.active",
  paused: "classes.paused",
} satisfies Record<ClassStatus, TranslationKey>;

export const weekdayShortLabelKeys = {
  monday: "weekday.short.monday",
  tuesday: "weekday.short.tuesday",
  wednesday: "weekday.short.wednesday",
  thursday: "weekday.short.thursday",
  friday: "weekday.short.friday",
  saturday: "weekday.short.saturday",
  sunday: "weekday.short.sunday",
} satisfies Record<Weekday, TranslationKey>;
