import { SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  defaultAttendeesFilter,
  type AttendeesFilter,
  type AttendeeStatusFilter,
  type AttendeeUserTypeFilter,
} from "@/schedule/types/attendees-filter.types";

const STATUS_OPTIONS: { value: AttendeeStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unmarked", label: "Unmarked" },
  { value: "attended", label: "Attended" },
  { value: "no_show", label: "No-show" },
];

const USER_TYPE_OPTIONS: { value: AttendeeUserTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New user" },
  { value: "returning", label: "Returning user" },
];

export function AttendeesFilterPopover({
  filter,
  onFilterChange,
}: {
  filter: AttendeesFilter;
  onFilterChange: (filter: AttendeesFilter) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Filter attendees"
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
          Filter attendees
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Status
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
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            User type
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
                {option.label}
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
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
