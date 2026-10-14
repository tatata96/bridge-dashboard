import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCategoriesQuery } from "@/api/categories/categories.api";
import { useClassPlansQuery } from "@/api/class-plans/class-plans.api";
import { useClassTypesQuery } from "@/api/class-types/class-types.api";
import { useVenuesQuery } from "@/api/venues/venues.api";
import { ClassesTable } from "@/classes/components/ClassesTable";
import { ClassesToolbar } from "@/classes/components/ClassesToolbar";
import {
  getClassPlanCategoryOptions,
  getClassPlanTopLevelCategoryId,
} from "@/classes/utils/class-plans.utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPagePath } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
import type { ClassFilters } from "@/types/classes";

const DEFAULT_FILTERS: ClassFilters = {
  categoryId: "all",
};

export function ClassPlansPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const classPlansQuery = useClassPlansQuery();
  const venuesQuery = useVenuesQuery();
  // A plan can keep pointing at a class type that was archived later, so both
  // lists are needed to find its category.
  const activeClassTypesQuery = useClassTypesQuery("active");
  const archivedClassTypesQuery = useClassTypesQuery("archived");
  const categoriesQuery = useCategoriesQuery();
  const [filters, setFilters] = useState<ClassFilters>(DEFAULT_FILTERS);

  // TODO: show paused and cancelled plans, with their status actions, once
  // the backend supports pausing and cancelling class plans.
  const activePlans = (classPlansQuery.data ?? []).filter(
    (classPlan) => classPlan.status === "ACTIVE",
  );
  const venuesById = new Map(
    (venuesQuery.data ?? []).map((venue) => [venue.id, venue]),
  );
  const classTypesById = new Map(
    [
      ...(activeClassTypesQuery.data ?? []),
      ...(archivedClassTypesQuery.data ?? []),
    ].map((classType) => [classType.id, classType]),
  );
  const categories = categoriesQuery.data ?? [];
  const categoryOptions = getClassPlanCategoryOptions(
    activePlans,
    classTypesById,
    categories,
  );

  const isFiltering = filters.categoryId !== DEFAULT_FILTERS.categoryId;

  const filteredPlans = activePlans.filter(
    (classPlan) =>
      filters.categoryId === "all" ||
      getClassPlanTopLevelCategoryId(classPlan, classTypesById, categories) ===
        filters.categoryId,
  );

  function addClass() {
    navigate(`${getPagePath("classes")}/add`);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  // Keep showing loaded plans even if a background refetch fails; the error
  // state is only for when there is nothing to show. Venue names are awaited
  // too so rows don't flash the unknown-venue fallback while they load.
  const isLoading = classPlansQuery.isPending || venuesQuery.isPending;

  return (
    <main className="flex h-[calc(100svh-var(--header-height))] min-w-0 flex-col gap-4 overflow-hidden p-4">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4">
        <ClassesToolbar
          categoryOptions={categoryOptions}
          filters={filters}
          onFilterChange={setFilters}
          onAddClass={addClass}
        />

        {classPlansQuery.isError && classPlansQuery.data ? (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground"
          >
            {t("classes.refreshError")}
            <Button
              variant="outline"
              size="sm"
              onClick={() => classPlansQuery.refetch()}
            >
              {t("auth.retry")}
            </Button>
          </div>
        ) : null}

        {classPlansQuery.isError && !classPlansQuery.data ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <p role="alert" className="text-sm text-muted-foreground">
              {t("classes.loadError")}
            </p>
            <Button variant="outline" onClick={() => classPlansQuery.refetch()}>
              {t("auth.retry")}
            </Button>
          </div>
        ) : isLoading ? (
          <div aria-busy="true" className="flex flex-col gap-2">
            <span role="status" className="sr-only">
              {t("classes.loading")}
            </span>
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : (
          <ClassesTable
            entries={filteredPlans}
            venuesById={venuesById}
            isFiltering={isFiltering}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </main>
  );
}
