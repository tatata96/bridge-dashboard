import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ClassesTable } from "@/classes/components/ClassesTable";
import { ClassesToolbar } from "@/classes/components/ClassesToolbar";
import { mockClasses } from "@/classes/data/classes.mock-data";
import { getPagePath } from "@/config/navigation";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { ClassFilters } from "@/types/classes";

const DEFAULT_FILTERS: ClassFilters = {
  classTypeId: "all",
  instructorId: "all",
};

export function ClassPlansPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ClassFilters>(DEFAULT_FILTERS);

  const isFiltering =
    filters.classTypeId !== DEFAULT_FILTERS.classTypeId ||
    filters.instructorId !== DEFAULT_FILTERS.instructorId;

  const filteredEntries = mockClasses.filter((classItem) => {
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
          entries={filteredEntries}
          instructors={mockInstructors}
          onEditEntry={editEntry}
          isFiltering={isFiltering}
          onClearFilters={clearFilters}
        />
      </div>
    </main>
  );
}
