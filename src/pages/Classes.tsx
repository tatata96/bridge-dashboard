import { useState } from "react";

import { ClassesTable } from "@/classes/components/ClassesTable";
import { ClassesToolbar } from "@/classes/components/ClassesToolbar";
import { mockClasses } from "@/classes/data/classes.mock-data";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { Class, ClassFilters } from "@/types/classes";

const DEFAULT_FILTERS: ClassFilters = {
  classId: "all",
  instructorId: "all",
};

const NEW_CLASS: Class = {
  id: "new-class",
  name: "New class",
  category: "",
  description: "",
  status: "active",
  instructorId: null,
  schedule: {
    type: "recurring",
    repeatOn: [],
    startDate: "",
    endDate: null,
  },
  startTime: "",
  durationMinutes: 60,
  capacity: 0,
  priceCredits: 0,
};

export function ClassesPage() {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    mockClasses[0]?.id ?? null,
  );
  const [filters, setFilters] = useState<ClassFilters>(DEFAULT_FILTERS);
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  const isFiltering =
    filters.classId !== DEFAULT_FILTERS.classId ||
    filters.instructorId !== DEFAULT_FILTERS.instructorId;

  const filteredEntries = mockClasses.filter((classItem) => {
    if (filters.classId !== "all" && classItem.id !== filters.classId) {
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

  const tableEntries = isCreatingClass
    ? [NEW_CLASS, ...filteredEntries]
    : filteredEntries;

  function addClass() {
    setIsCreatingClass(true);
    setSelectedEntryId(NEW_CLASS.id);
  }

  function selectEntry(entryId: string) {
    setIsCreatingClass(entryId === NEW_CLASS.id);
    setSelectedEntryId(entryId);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4">
      <div className="flex w-full min-w-0 flex-col gap-4">
        <ClassesToolbar
          classes={mockClasses}
          instructors={mockInstructors}
          filters={filters}
          onFilterChange={setFilters}
          onAddClass={addClass}
        />
        <ClassesTable
          entries={tableEntries}
          instructors={mockInstructors}
          selectedEntryId={selectedEntryId}
          onSelectEntry={selectEntry}
          isFiltering={isFiltering}
          onClearFilters={clearFilters}
        />
      </div>
    </main>
  );
}
