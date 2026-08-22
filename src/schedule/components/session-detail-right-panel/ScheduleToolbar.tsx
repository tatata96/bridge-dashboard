import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/config/class-types";
import { useI18n } from "@/i18n/i18n";

function TypeFilterValue({ value }: { value: string }) {
  const { t } = useI18n();
  const classType = categories.find((option) => option.id === value);

  if (value === "all") return t("schedule.allClasses");

  return classType ? t(classType.labelKey) : value;
}

export function ScheduleToolbar({
  selectedDate,
  onDateChange,
  onPrevDay,
  onNextDay,
  typeFilter,
  onTypeFilterChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}) {
  const { dateLocale, t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DatePicker
        value={selectedDate}
        onChange={(date) => {
          if (date) onDateChange(date);
        }}
        label={t("schedule.date")}
        locale={dateLocale}
        className="w-56"
        stepper={{
          onPrevious: onPrevDay,
          onNext: onNextDay,
          previousLabel: t("schedule.previousDay"),
          nextLabel: t("schedule.nextDay"),
        }}
      />

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-40 gap-2">
          <span className="text-muted-foreground">{t("schedule.type")}</span>
          <SelectValue>
            <TypeFilterValue value={typeFilter} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("schedule.allClasses")}</SelectItem>
          {categories.map((classType) => (
            <SelectItem key={classType.id} value={classType.id}>
              {t(classType.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
