import { useState } from "react";

import { useClassTypesQuery } from "@/api/class-types/class-types.api";
import type { ClassTypeStatus } from "@/api/class-types/class-types.types";
import { ClassTypesTable } from "@/class-types/components/ClassTypesTable";
import { Button } from "@/components/ui/button";
import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/i18n";

export function ClassTypesPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<ClassTypeStatus>("active");
  const classTypesQuery = useClassTypesQuery(status);

  // Keep showing loaded data even if a background refetch fails; the error
  // state is only for when there is nothing to show.
  const classTypes = classTypesQuery.data;

  return (
    <main className="flex h-[calc(100svh-var(--header-height))] min-w-0 flex-col gap-4 overflow-hidden p-4">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4">
        <SegmentedToggle
          aria-label={t("classTypes.statusFilter")}
          value={status}
          onValueChange={setStatus}
          options={[
            { value: "active", label: t("classTypes.active") },
            { value: "archived", label: t("classTypes.archived") },
          ]}
        />

        {classTypesQuery.isError && classTypes ? (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground"
          >
            {t("classTypes.refreshError")}
            <Button
              variant="outline"
              size="sm"
              onClick={() => classTypesQuery.refetch()}
            >
              {t("auth.retry")}
            </Button>
          </div>
        ) : null}

        {classTypes ? (
          <ClassTypesTable
            classTypes={classTypes}
            isArchived={status === "archived"}
            emptyMessage={t(
              status === "active"
                ? "classTypes.noActive"
                : "classTypes.noArchived",
            )}
          />
        ) : classTypesQuery.isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <p role="alert" className="text-sm text-muted-foreground">
              {t("classTypes.loadError")}
            </p>
            <Button variant="outline" onClick={() => classTypesQuery.refetch()}>
              {t("auth.retry")}
            </Button>
          </div>
        ) : (
          <div aria-busy="true" className="flex flex-col gap-2">
            <span role="status" className="sr-only">
              {t("classTypes.loading")}
            </span>
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        )}
      </div>
    </main>
  );
}
