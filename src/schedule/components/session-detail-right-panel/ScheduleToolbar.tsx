import type { CategoryResponse } from "@/api/categories/categories.types";
import type { VenueResponse } from "@/api/partners/partners.types";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/i18n";
import { ALL_FILTER_VALUE } from "@/schedule/utils/schedule-sessions.utils";

export function ScheduleToolbar({
  selectedDate,
  onDateChange,
  onPrevDay,
  onNextDay,
  categories,
  typeFilter,
  onTypeFilterChange,
  venues,
  venueFilter,
  onVenueFilterChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  categories: CategoryResponse[];
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  venues: VenueResponse[];
  venueFilter: string;
  onVenueFilterChange: (value: string) => void;
}) {
  const { dateLocale, t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DatePicker
        value={selectedDate}
        onChange={(date) => {
          if (date) {
            onDateChange(date);
          }
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
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>
            {t("schedule.allClasses")}
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={venueFilter} onValueChange={onVenueFilterChange}>
        <SelectTrigger className="w-52 gap-2">
          <span className="text-muted-foreground">{t("venues.venue")}</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>
            {t("venues.allVenues")}
          </SelectItem>
          {venues.map((venue) => (
            <SelectItem key={venue.id} value={venue.id}>
              {venue.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
