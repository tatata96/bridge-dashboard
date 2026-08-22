import { Link } from "react-router-dom";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InfoNotice } from "@/components/ui/info-notice";
import { getPagePath } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
import { ClassSessionSummary } from "@/schedule/components/session-detail-right-panel/ClassSessionSummary";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";

function PauseDescription({
  summaryEntry,
}: {
  summaryEntry: ScheduleListEntry;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <span>{t("classes.pausePlanStopsNewBookings")}</span>
        <span className="font-semibold">
          {t("classes.pausePlanExistingBookingsUnaffected")}
        </span>
        <span>{t("classes.pausePlanReactivateAnytime")}</span>
      </div>
      <ClassSessionSummary entry={summaryEntry} showDate />
      <InfoNotice>
        <p>
          {t("classes.pausePlanCancelSessionsPrefix")}{" "}
          <Link
            to={getPagePath("schedule")}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {t("classes.pausePlanViewUpcomingSessions")}
          </Link>
        </p>
      </InfoNotice>
    </div>
  );
}

export function PauseClassPlanDialog({
  open,
  onOpenChange,
  summaryEntry,
  isPausing,
  pauseError,
  onConfirm,
  contentProps,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summaryEntry: ScheduleListEntry;
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
      title={t("classes.pausePlanTitle")}
      body={<PauseDescription summaryEntry={summaryEntry} />}
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
