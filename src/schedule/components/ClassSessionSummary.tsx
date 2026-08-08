import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";

function formatSessionTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ClassSessionSummary({ entry }: { entry: ScheduleListEntry }) {
  const { session, className, instructorName } = entry;

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
      <span className="font-medium text-foreground">
        {className} · {instructorName} ·{" "}
        {formatSessionTime(new Date(session.startAt))}
      </span>
    </div>
  );
}
