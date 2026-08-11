import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classTypes } from "@/config/class-types";
import { useI18n } from "@/i18n/i18n";
import { formatShortDate } from "@/lib/date.utils";

function TypeFilterValue({ value }: { value: string }) {
  const { t } = useI18n();
  const classType = classTypes.find((option) => option.id === value);

  if (value === "all") return t("schedule.allClasses");

  return classType ? t(classType.labelKey) : value;
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
          <SelectItem value="all">{t("schedule.allClasses")}</SelectItem>
          {classTypes.map((classType) => (
            <SelectItem key={classType.id} value={classType.id}>
              {t(classType.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
