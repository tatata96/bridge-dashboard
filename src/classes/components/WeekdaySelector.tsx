import { weekdayShortLabelKeys } from "@/config/class-labels";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/classnames.utils";
import type { Weekday } from "@/types/classes";

const weekdays: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function WeekdaySelector({
  value,
  onChange,
}: {
  value: Weekday[];
  onChange: (value: Weekday[]) => void;
}) {
  const { t } = useI18n();

  function toggleDay(day: Weekday) {
    onChange(
      value.includes(day)
        ? value.filter((selectedDay) => selectedDay !== day)
        : [...value, day],
    );
  }

  return (
    <div className="grid grid-cols-7 overflow-hidden rounded-md border border-input bg-input/30">
      {weekdays.map((day) => {
        const isSelected = value.includes(day);

        return (
          <button
            key={day}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggleDay(day)}
            className={cn(
              "flex h-9 min-w-0 items-center justify-center border-r border-border px-2 text-sm font-medium text-foreground transition-colors last:border-r-0 hover:bg-input/50 focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              isSelected && "bg-primary text-primary-foreground",
            )}
          >
            {t(weekdayShortLabelKeys[day])}
          </button>
        );
      })}
    </div>
  );
}
