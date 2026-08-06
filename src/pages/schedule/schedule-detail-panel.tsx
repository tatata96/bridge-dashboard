import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTime } from "@/lib/date.utils";
import type { ScheduleListEntry } from "@/pages/schedule/schedule-class-list";

export function ScheduleDetailPanel({
  entry,
  onClassPassCapacityChange,
}: {
  entry: ScheduleListEntry | undefined;
  onClassPassCapacityChange: (sessionId: string, capacity: number) => void;
}) {
  if (!entry) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        Select a class to see its details.
      </div>
    );
  }

  const { session, className, instructorName } = entry;
  const capacityOptions = Array.from(
    { length: session.capacity + 1 },
    (_, capacity) => capacity,
  );

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">
              {formatTime(new Date(session.startAt))}
            </span>
            <span className="text-sm text-muted-foreground">
              {session.durationMinutes} min
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-foreground">
              {className}
            </span>
            <span className="text-sm text-muted-foreground">
              {instructorName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">ClassPass</span>
          <span className="font-medium text-foreground">
            {session.classPassReservedCount}
          </span>
          <span className="text-muted-foreground">of</span>
          <Select
            value={String(session.classPassCapacity)}
            onValueChange={(value) =>
              onClassPassCapacityChange(session.id, Number(value))
            }
          >
            <SelectTrigger size="sm" className="w-16">
              <SelectValue>{session.classPassCapacity}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {capacityOptions.map((capacity) => (
                <SelectItem key={capacity} value={String(capacity)}>
                  {capacity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
