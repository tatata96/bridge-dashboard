import { SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useI18n, type TranslationKey } from "@/i18n/i18n";
import {
  defaultAttendeesFilter,
  type AttendeesFilter,
  type AttendeeStatusFilter,
  type AttendeeUserTypeFilter,
} from "@/schedule/types/attendees-filter.types";

const STATUS_OPTIONS = [
  { value: "all", labelKey: "filters.all" },
  { value: "unmarked", labelKey: "filters.unmarked" },
  { value: "attended", labelKey: "filters.attended" },
  { value: "no_show", labelKey: "filters.noShow" },
] satisfies { value: AttendeeStatusFilter; labelKey: TranslationKey }[];

const USER_TYPE_OPTIONS = [
  { value: "all", labelKey: "filters.all" },
  { value: "new", labelKey: "filters.newUser" },
  { value: "returning", labelKey: "filters.returningUser" },
] satisfies { value: AttendeeUserTypeFilter; labelKey: TranslationKey }[];

export function AttendeesFilterPopover({
  filter,
  onFilterChange,
}: {
  filter: AttendeesFilter;
  onFilterChange: (filter: AttendeesFilter) => void;
}) {
  const { t } = useI18n();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("filters.filterAttendees")}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontalIcon className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        avoidCollisions={false}
        aria-labelledby="attendees-filter-title"
        className="w-64"
      >
        <p
          id="attendees-filter-title"
          className="text-sm font-semibold text-foreground"
        >
          {t("filters.filterAttendees")}
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {t("filters.status")}
          </span>
          <RadioGroup
            value={filter.status}
            onValueChange={(value) =>
              onFilterChange({
                ...filter,
                status: value as AttendeeStatusFilter,
              })
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <RadioGroupItem value={option.value} />
                {t(option.labelKey)}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {t("filters.userType")}
          </span>
          <RadioGroup
            value={filter.userType}
            onValueChange={(value) =>
              onFilterChange({
                ...filter,
                userType: value as AttendeeUserTypeFilter,
              })
            }
          >
            {USER_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <RadioGroupItem value={option.value} />
                {t(option.labelKey)}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(defaultAttendeesFilter)}
          >
            {t("filters.clear")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
