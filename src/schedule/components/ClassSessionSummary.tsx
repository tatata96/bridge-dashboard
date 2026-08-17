import { useI18n } from "@/i18n/i18n";
import { formatShortDateWithYear } from "@/lib/date.utils";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";

function formatSessionTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ClassSessionSummary({
  entry,
  showDate = false,
}: {
  entry: ScheduleListEntry;
  showDate?: boolean;
}) {
  const { session, className, instructorName } = entry;
  const { dateLocale } = useI18n();
  const sessionStart = new Date(session.startAt);

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
      {showDate ? (
        <div className="flex flex-col gap-1 font-medium text-foreground">
          <span>
            {className} · {instructorName}
          </span>
          <span>{formatShortDateWithYear(sessionStart, dateLocale)}</span>
          <span>{formatSessionTime(sessionStart, dateLocale)}</span>
        </div>
      ) : (
        <span className="font-medium text-foreground">
          {className} · {instructorName} ·{" "}
          {formatSessionTime(sessionStart, dateLocale)}
        </span>
      )}
    </div>
  );
}
