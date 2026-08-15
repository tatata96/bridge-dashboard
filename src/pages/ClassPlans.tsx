import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ClassesTable } from "@/classes/components/ClassesTable";
import { ClassesToolbar } from "@/classes/components/ClassesToolbar";
import { mockClasses } from "@/classes/data/classes.mock-data";
import { getPagePath } from "@/config/navigation";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [classes, setClasses] = useState(() => mockClasses);
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

  async function pauseEntry(entryId: string) {
    updateClassStatus(entryId, "paused");

    try {
      await saveClassStatus(entryId, "paused");
      toast({ title: "Ders duraklatıldı" });
    } catch (error) {
      updateClassStatus(entryId, "active");
      throw error;
    }
  }

  function activateEntry(entryId: string) {
    updateClassStatus(entryId, "active");
    toast({
      title: "Ders aktifleştirildi",
      action: {
        label: "Geri al",
        onClick: () => updateClassStatus(entryId, "paused"),
      },
    });
  }

  function getUpcomingBookingCount(entryId: string) {
    const now = Date.now();

    return mockClassSessions
      .filter(
        (session) =>
          session.classId === entryId &&
          new Date(session.startAt).getTime() > now,
      )
      .reduce((count, session) => count + session.reservedCount, 0);
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
          getUpcomingBookingCount={getUpcomingBookingCount}
          isFiltering={isFiltering}
          onClearFilters={clearFilters}
        />
      </div>
    </main>
  );
}

async function saveClassStatus(entryId: string, status: "active" | "paused") {
  void entryId;
  void status;
  await new Promise((resolve) => window.setTimeout(resolve, 300));
}
