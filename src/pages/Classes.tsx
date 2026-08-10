import { useState } from "react";

import { ClassesTable } from "@/classes/components/ClassesTable";
import { mockClassListEntries } from "@/classes/data/classes.mock-data";

export function ClassesPage() {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    mockClassListEntries[0]?.id ?? null,
  );

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col xl:w-[clamp(34rem,2vw,58rem)] xl:flex-none">
          <ClassesTable
            entries={mockClassListEntries}
            selectedEntryId={selectedEntryId}
            onSelectEntry={setSelectedEntryId}
          />
        </div>
        <div className="min-h-64 flex-1 rounded-lg border border-border bg-background" />
      </div>
    </main>
  );
}
