import { useI18n } from "@/i18n/i18n";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";

function formatSessionTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ClassSessionSummary({ entry }: { entry: ScheduleListEntry }) {
  const { session, className, instructorName } = entry;
  const { dateLocale } = useI18n();

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
      <span className="font-medium text-foreground">
        {className} · {instructorName} ·{" "}
        {formatSessionTime(new Date(session.startAt), dateLocale)}
      </span>
    </div>
  );
}
