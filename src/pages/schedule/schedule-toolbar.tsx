import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatShortDate } from "@/lib/date.utils";

// TODO: derive from the distinct categories in the loaded classes once mock/real data lands.
const CLASS_TYPE_OPTIONS = [
  { value: "all", label: "All classes" },
  { value: "crossfit", label: "CrossFit" },
  { value: "dance", label: "Dance" },
  { value: "yoga", label: "Yoga" },
];

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
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex h-9 w-60 items-center gap-2 rounded-4xl border border-input bg-input/30 px-3 text-sm">
        <span className="text-muted-foreground">Date</span>
        <span className="min-w-24 flex-1 font-medium text-primary">
          {formatShortDate(selectedDate)}
        </span>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Previous day"
            onClick={onPrevDay}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Next day"
            onClick={onNextDay}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-40 gap-2">
          <span className="text-muted-foreground">Type</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="start" sideOffset={4}>
          {CLASS_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
