import { useState } from "react";

import { addDays } from "@/lib/date.utils";
import { ScheduleToolbar } from "@/pages/schedule/schedule-toolbar";

export function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <ScheduleToolbar
        selectedDate={selectedDate}
        onPrevDay={() => setSelectedDate((date) => addDays(date, -1))}
        onNextDay={() => setSelectedDate((date) => addDays(date, 1))}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
    </main>
  );
}
