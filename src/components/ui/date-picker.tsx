import { useMemo, useState } from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/classnames.utils";
import {
  addDays,
  addMonths,
  formatShortDate,
  isSameDay,
  isSameMonth,
} from "@/lib/date.utils";

type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
  locale?: string;
  placeholder?: string;
  clearLabel?: string;
  className?: string;
  stepper?: {
    onPrevious: () => void;
    onNext: () => void;
    previousLabel: string;
    nextLabel: string;
  };
};

function getCalendarDays(month: Date) {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(monthStart, -monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function formatMonthLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getWeekdayLabels(locale: string) {
  const sunday = new Date(2026, 0, 4);

  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      addDays(sunday, index),
    ),
  );
}

function DatePicker({
  value,
  onChange,
  label,
  locale = "en-US",
  placeholder = label,
  clearLabel,
  className,
  stepper,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewedMonth, setViewedMonth] = useState(() =>
    value
      ? new Date(value.getFullYear(), value.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const calendarDays = useMemo(
    () => getCalendarDays(viewedMonth),
    [viewedMonth],
  );
  const weekdayLabels = useMemo(() => getWeekdayLabels(locale), [locale]);

  function selectDate(date: Date) {
    onChange(date);
    setViewedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && value) {
      setViewedMonth(new Date(value.getFullYear(), value.getMonth(), 1));
    }

    setOpen(nextOpen);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {stepper ? (
        <div
          className={cn(
            "flex h-9 w-full items-center overflow-hidden rounded-4xl border border-border bg-input/30",
            className,
          )}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="min-w-0 flex-1 justify-start rounded-none bg-transparent hover:bg-input/50"
              aria-label={label}
            >
              <CalendarIcon data-icon="inline-start" />
              <span
                className={cn(
                  "min-w-0 truncate",
                  !value && "text-muted-foreground",
                )}
              >
                {value ? formatShortDate(value, locale) : placeholder}
              </span>
            </Button>
          </PopoverTrigger>
          <div className="flex shrink-0 items-center px-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={stepper.previousLabel}
              onClick={stepper.onPrevious}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={stepper.nextLabel}
              onClick={stepper.onNext}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      ) : (
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start", className)}
            aria-label={label}
          >
            <CalendarIcon data-icon="inline-start" />
            <span className={cn(!value && "text-muted-foreground")}>
              {value ? formatShortDate(value, locale) : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent align="start" className="w-72 gap-3 rounded-lg p-3">
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Previous month"
            onClick={() => setViewedMonth((date) => addMonths(date, -1))}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm font-semibold text-foreground">
            {formatMonthLabel(viewedMonth, locale)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Next month"
            onClick={() => setViewedMonth((date) => addMonths(date, 1))}
          >
            <ChevronRightIcon />
          </Button>
        </div>

        {value && clearLabel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit self-end"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            <XIcon data-icon="inline-start" />
            {clearLabel}
          </Button>
        )}

        <div className="grid grid-cols-7 gap-1">
          {weekdayLabels.map((weekday) => (
            <span
              key={weekday}
              className="flex size-8 items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {weekday}
            </span>
          ))}
          {calendarDays.map((date) => {
            const selected = value ? isSameDay(date, value) : false;
            const muted = !isSameMonth(date, viewedMonth);

            return (
              <Button
                key={date.toISOString()}
                type="button"
                variant={selected ? "default" : "ghost"}
                size="icon-sm"
                className={cn(
                  "size-8 rounded-md text-sm",
                  muted && !selected && "text-muted-foreground/50",
                )}
                aria-pressed={selected}
                onClick={() => selectDate(date)}
              >
                {date.getDate()}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
