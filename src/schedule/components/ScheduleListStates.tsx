import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/i18n";

const messageBoxClassName =
  "flex min-h-24 flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background p-6 text-center text-sm text-muted-foreground";

export function ScheduleListLoading() {
  const { t } = useI18n();

  return (
    <div
      role="status"
      aria-busy="true"
      className="flex flex-1 flex-col gap-3 rounded-lg border border-border bg-background p-4"
    >
      <span className="sr-only">{t("schedule.loading")}</span>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

// Empty results (no sessions, no filter matches).
export function ScheduleListMessage({ message }: { message: string }) {
  return (
    <div role="status" className={messageBoxClassName}>
      {message}
    </div>
  );
}

// The blocking error, shown when there is no cached data to fall back on.
export function ScheduleListError({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const { t } = useI18n();

  return (
    <div className={messageBoxClassName}>
      <p role="alert">{t("schedule.loadError")}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isRetrying}
        onClick={onRetry}
      >
        {t("auth.retry")}
      </Button>
    </div>
  );
}

// The non-blocking error, shown above the cached sessions when a background
// refetch fails.
export function ScheduleRefreshError({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
      <p role="alert">{t("schedule.refreshError")}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isRetrying}
        onClick={onRetry}
      >
        {t("auth.retry")}
      </Button>
    </div>
  );
}
