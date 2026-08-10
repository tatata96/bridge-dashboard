import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/i18n";
import { formatShortDate } from "@/lib/date.utils";

// TODO: derive from the distinct categories in the loaded classes once mock/real data lands.
const CLASS_TYPE_OPTIONS = [
  { value: "all", labelKey: "schedule.allClasses" },
  { value: "crossfit", labelKey: "schedule.crossfit" },
  { value: "dance", labelKey: "schedule.dance" },
  { value: "yoga", labelKey: "schedule.yoga" },
] as const;

const typeFilterLabels = {
  all: "schedule.allClasses",
  crossfit: "schedule.crossfit",
  dance: "schedule.dance",
  yoga: "schedule.yoga",
} as const;

type ClassTypeFilter = keyof typeof typeFilterLabels;

function isClassTypeFilter(value: string): value is ClassTypeFilter {
  return value in typeFilterLabels;
}

function TypeFilterValue({ value }: { value: string }) {
  const { t } = useI18n();

  return isClassTypeFilter(value) ? t(typeFilterLabels[value]) : value;
}

export function ScheduleToolbar({
  selectedDate,
  onPrevDay,
  onNextDay,
  typeFilter,
  onTypeFilterChange,
}: {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}) {
  const { dateLocale, t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex h-9 w-60 items-center gap-2 rounded-4xl border border-input bg-input/30 px-3 text-sm">
        <span className="text-muted-foreground">{t("schedule.date")}</span>
        <span className="min-w-24 flex-1 font-medium">
          {formatShortDate(selectedDate, dateLocale)}
        </span>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={t("schedule.previousDay")}
            onClick={onPrevDay}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={t("schedule.nextDay")}
            onClick={onNextDay}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-40 gap-2">
          <span className="text-muted-foreground">{t("schedule.type")}</span>
          <SelectValue>
            <TypeFilterValue value={typeFilter} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {CLASS_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
