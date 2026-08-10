import { useState } from "react";

import { ClassesDetailPanel } from "@/classes/components/ClassesDetailPanel";
import { ClassesTable } from "@/classes/components/ClassesTable";
import { ClassesToolbar } from "@/classes/components/ClassesToolbar";
import {
  mockClasses,
  mockClassRecurrences,
} from "@/classes/data/classes.mock-data";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type {
  Class,
  ClassFilters,
  ClassListEntry,
  ClassRecurrence,
} from "@/types/classes";
import type { Instructor } from "@/types/schedule";

const DEFAULT_FILTERS: ClassFilters = {
  classId: "all",
  instructorId: "all",
};

const NEW_CLASS_ENTRY: ClassListEntry = {
  id: "new-class",
  classId: "new-class",
  className: "New class",
  status: "active",
  instructorId: null,
  instructorName: "",
  startTime: "",
  repeatOn: [],
};

function getInstructorName(
  instructorId: string | null,
  instructors: Instructor[],
) {
  if (!instructorId) return "No staff specified";
  return (
    instructors.find((instructor) => instructor.id === instructorId)?.name ??
    "Unknown instructor"
  );
}

function toClassListEntries({
  classes,
  recurrences,
  instructors,
}: {
  classes: Class[];
  recurrences: ClassRecurrence[];
  instructors: Instructor[];
}): ClassListEntry[] {
  const classesById = new Map(
    classes.map((classItem) => [classItem.id, classItem]),
  );

  return recurrences.flatMap((recurrence) => {
    const classItem = classesById.get(recurrence.classId);
    if (!classItem) return [];

    return {
      id: recurrence.id,
      classId: classItem.id,
      className: classItem.name,
      status: classItem.status,
      instructorId: recurrence.instructorId,
      instructorName: getInstructorName(recurrence.instructorId, instructors),
      startTime: recurrence.startTime,
      repeatOn: recurrence.repeatOn,
    };
  });
}

export function ClassesPage() {
  const classListEntries = toClassListEntries({
    classes: mockClasses,
    recurrences: mockClassRecurrences,
    instructors: mockInstructors,
  });
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    classListEntries[0]?.id ?? null,
  );
  const [filters, setFilters] = useState<ClassFilters>(DEFAULT_FILTERS);
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  const isFiltering =
    filters.classId !== DEFAULT_FILTERS.classId ||
    filters.instructorId !== DEFAULT_FILTERS.instructorId;

  const filteredEntries = classListEntries.filter((entry) => {
    if (filters.classId !== "all" && entry.classId !== filters.classId) {
      return false;
    }
    if (filters.instructorId === "none") {
      return entry.instructorId === null;
    }
    if (filters.instructorId !== "all") {
      return entry.instructorId === filters.instructorId;
    }

    return true;
  });

  const tableEntries = isCreatingClass
    ? [NEW_CLASS_ENTRY, ...filteredEntries]
    : filteredEntries;

  const selectedEntry = tableEntries.find(
    (entry) => entry.id === selectedEntryId,
  );

  function addClass() {
    setIsCreatingClass(true);
    setSelectedEntryId(NEW_CLASS_ENTRY.id);
  }

  function selectEntry(entryId: string) {
    setIsCreatingClass(entryId === NEW_CLASS_ENTRY.id);
    setSelectedEntryId(entryId);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[clamp(34rem,52vw,58rem)] xl:flex-none">
          <ClassesToolbar
            classes={mockClasses}
            instructors={mockInstructors}
            filters={filters}
            onFilterChange={setFilters}
            onAddClass={addClass}
          />
          <ClassesTable
            entries={tableEntries}
            selectedEntryId={selectedEntryId}
            onSelectEntry={selectEntry}
            isFiltering={isFiltering}
            onClearFilters={clearFilters}
          />
        </div>
        <ClassesDetailPanel
          mode={isCreatingClass ? "create" : selectedEntry ? "view" : "empty"}
          onAddClass={addClass}
        />
      </div>
    </main>
  );
}
