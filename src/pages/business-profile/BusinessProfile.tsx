import { useBusinessProfileQuery } from "@/api/partners/partners.api";
import { useVenuesQuery } from "@/api/venues/venues.api";
import { BusinessProfileForm } from "@/business-profile/components/BusinessProfileForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/i18n";

// Data wins over errors: a failed background refetch keeps the form on screen
// with the last loaded values.
export function BusinessProfilePage() {
  const { t } = useI18n();
  const profileQuery = useBusinessProfileQuery();
  const venuesQuery = useVenuesQuery();

  if (profileQuery.data && venuesQuery.data) {
    return (
      <BusinessProfileForm
        profile={profileQuery.data}
        initialVenues={venuesQuery.data}
      />
    );
  }

  if (profileQuery.isError || venuesQuery.isError) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p role="alert" className="text-sm text-muted-foreground">
          {t("businessProfile.loadError")}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            if (profileQuery.isError) profileQuery.refetch();
            if (venuesQuery.isError) venuesQuery.refetch();
          }}
        >
          {t("auth.retry")}
        </Button>
      </main>
    );
  }

  return (
    <main
      aria-busy="true"
      className="grid min-w-0 flex-1 grid-cols-1 items-start gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2"
    >
      <span role="status" className="sr-only">
        {t("businessProfile.loading")}
      </span>
      <Skeleton className="h-72 lg:col-span-2" />
      <Skeleton className="h-56" />
      <Skeleton className="h-56" />
      <Skeleton className="h-96 lg:col-span-2" />
    </main>
  );
}
