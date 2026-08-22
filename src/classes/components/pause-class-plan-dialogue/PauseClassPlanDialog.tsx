import { Link } from "react-router-dom";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { weekdayLongLabelKeys } from "@/config/class-labels";
import { getPagePath } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
import type { ClassPlan } from "@/types/classes";

export type UpcomingSessionSummary = {
  sessionCount: number;
  bookingCount: number;
};

function getPauseScheduleLabel(
  entry: ClassPlan,
  t: ReturnType<typeof useI18n>["t"],
) {
  if (entry.schedule.type === "recurring") {
    return entry.schedule.repeatOn
      .map((weekday) => t(weekdayLongLabelKeys[weekday]))
      .join("/");
  }

  return entry.schedule.date;
}

function getPauseTitle(entry: ClassPlan, t: ReturnType<typeof useI18n>["t"]) {
  return t("classes.pausePlanTitle", {
    name: entry.name,
    schedule: getPauseScheduleLabel(entry, t),
    time: entry.startTime,
  });
}

function PauseDescription({ summary }: { summary: UpcomingSessionSummary }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p>{t("classes.pausePlanStopsNewBookings")}</p>
        <p>{t("classes.pausePlanExistingBookingsUnaffected")}</p>
      </div>
      {summary.bookingCount > 0 ? (
        <p>
          {t("classes.pausePlanUpcomingBookingsWarning", {
            sessionCount: summary.sessionCount,
            bookingCount: summary.bookingCount,
          })}
        </p>
      ) : null}
      <p>
        {t("classes.pausePlanCancelSessionsPrefix")} <br />
        <span aria-hidden="true">→</span>{" "}
        <Link
          to={getPagePath("schedule")}
          className="font-semibold text-primary underline underline-offset-4"
        >
          {t("classes.pausePlanViewUpcomingSessions")}
        </Link>
      </p>
    </div>
  );
}

export function PauseClassPlanDialog({
  entry,
  open,
  onOpenChange,
  summary,
  isPausing,
  pauseError,
  onConfirm,
  contentProps,
}: {
  entry: ClassPlan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: UpcomingSessionSummary;
  isPausing: boolean;
  pauseError: string | null;
  onConfirm: () => void;
  contentProps?: Parameters<typeof ConfirmDialog>[0]["contentProps"];
}) {
  const { t } = useI18n();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={getPauseTitle(entry, t)}
      body={<PauseDescription summary={summary} />}
      cancelLabel={t("classes.keepActive")}
      confirmLabel={isPausing ? t("classes.pausing") : t("classes.pause")}
      tone="neutral"
      onConfirm={onConfirm}
      confirmDisabled={isPausing}
      contentProps={contentProps}
    >
      {pauseError ? (
        <p className="text-sm text-destructive" role="alert">
          {pauseError}
        </p>
      ) : null}
    </ConfirmDialog>
  );
}
