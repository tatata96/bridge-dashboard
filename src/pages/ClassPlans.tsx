import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ClassesTable } from "@/classes/components/ClassesTable";
import { ClassesToolbar } from "@/classes/components/ClassesToolbar";
import { mockClasses } from "@/classes/data/classes.mock-data";
import { getClassPlanSummaryEntry } from "@/classes/utils/class-sessions.utils";
import { saveClassStatus } from "@/classes/utils/class-status.utils";
import { getPagePath } from "@/config/navigation";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/i18n";
import {
  mockClassSessions,
  mockInstructors,
} from "@/schedule/data/schedule.mock-data";
import type { ClassFilters } from "@/types/classes";

const DEFAULT_FILTERS: ClassFilters = {
  classTypeId: "all",
  instructorId: "all",
};

export function ClassPlansPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const returnedPausedClassId = (
    location.state as { pausedClassId?: string } | null
  )?.pausedClassId;
  const [classes, setClasses] = useState(() =>
    returnedPausedClassId
      ? mockClasses.map((classItem) =>
          classItem.id === returnedPausedClassId
            ? { ...classItem, status: "paused" as const }
            : classItem,
        )
      : mockClasses,
  );
  const [filters, setFilters] = useState<ClassFilters>(DEFAULT_FILTERS);

  const isFiltering =
    filters.classTypeId !== DEFAULT_FILTERS.classTypeId ||
    filters.instructorId !== DEFAULT_FILTERS.instructorId;

  const filteredEntries = classes.filter((classItem) => {
    if (
      filters.classTypeId !== "all" &&
      classItem.classTypeId !== filters.classTypeId
    ) {
      return false;
    }
    if (filters.instructorId === "none") {
      return classItem.instructorId === null;
    }
    if (filters.instructorId !== "all") {
      return classItem.instructorId === filters.instructorId;
    }

    return true;
  });

  function addClass() {
    navigate(`${getPagePath("classes")}/add`);
  }

  function editEntry(entryId: string) {
    navigate(`${getPagePath("classes")}/${entryId}/edit`);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function updateClassStatus(entryId: string, status: "active" | "paused") {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === entryId ? { ...classItem, status } : classItem,
      ),
    );
  }

  useEffect(() => {
    if (!returnedPausedClassId) return;

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, navigate, returnedPausedClassId]);

  async function pauseEntry(entryId: string) {
    updateClassStatus(entryId, "paused");

    try {
      await saveClassStatus(entryId, "paused");
      toast({ title: t("toast.classPaused") });
    } catch (error) {
      updateClassStatus(entryId, "active");
      throw error;
    }
  }

  function activateEntry(entryId: string) {
    updateClassStatus(entryId, "active");
    toast({
      title: t("toast.classActivated"),
      action: {
        label: t("common.undo"),
        onClick: () => updateClassStatus(entryId, "paused"),
      },
    });
  }

  return (
    <main className="flex h-[calc(100svh-var(--header-height))] min-w-0 flex-col gap-4 overflow-hidden p-4">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4">
        <ClassesToolbar
          classes={classes}
          instructors={mockInstructors}
          filters={filters}
          onFilterChange={setFilters}
          onAddClass={addClass}
        />
        <ClassesTable
          entries={filteredEntries}
          instructors={mockInstructors}
          onEditEntry={editEntry}
          onPauseEntry={pauseEntry}
          onActivateEntry={activateEntry}
          getClassPlanSummaryEntry={(entry) =>
            getClassPlanSummaryEntry(
              entry,
              mockClassSessions,
              mockInstructors,
              t("classes.noInstructorAssigned"),
              t("classes.unknownInstructor"),
            )
          }
          isFiltering={isFiltering}
          onClearFilters={clearFilters}
        />
      </div>
    </main>
  );
}
