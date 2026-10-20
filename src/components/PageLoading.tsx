import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/i18n";

// Content-area placeholder shown inside the dashboard shell while the
// session and account are resolving.
export function DashboardContentSkeleton() {
  const { t } = useI18n();

  return (
    <main role="status" aria-busy="true" className="flex flex-col gap-4 p-6">
      <span className="sr-only">{t("auth.accountLoading")}</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </main>
  );
}

// Used by routes that have no app shell, such as onboarding.
export function FullPageLoading() {
  const { t } = useI18n();

  return (
    <div role="status" className="flex min-h-svh items-center justify-center">
      <span className="text-sm text-muted-foreground">
        {t("auth.accountLoading")}
      </span>
    </div>
  );
}
