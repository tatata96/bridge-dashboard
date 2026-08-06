import { useState } from "react";
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
} from "@/pages/schedule/tabs/attendees-filter.types";

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
  onApply,
}: {
  filter: AttendeesFilter;
  onApply: (filter: AttendeesFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filter);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setDraft(filter);
      }}
    >
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
            value={draft.status}
            onValueChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                status: value as AttendeeStatusFilter,
              }))
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
            value={draft.userType}
            onValueChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                userType: value as AttendeeUserTypeFilter,
              }))
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

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDraft(defaultAttendeesFilter)}
          >
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
