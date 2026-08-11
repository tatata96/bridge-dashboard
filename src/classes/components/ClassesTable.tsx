import {
  classStatusLabelKeys,
  weekdayShortLabelKeys,
} from "@/config/class-labels";
import { useI18n } from "@/i18n/i18n";
import type { ClassPlan } from "@/types/classes";
import type { Instructor } from "@/types/schedule";

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

export function ClassesTable({
  entries,
  instructors,
  onEditEntry,
  isFiltering,
  onClearFilters,
}: {
  entries: ClassPlan[];
  instructors: Instructor[];
  onEditEntry: (entryId: string) => void;
  isFiltering: boolean;
  onClearFilters: () => void;
}) {
  const { t } = useI18n();

  if (entries.length === 0 && !isFiltering) {
    return (
      <div className="flex min-h-24 flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        {t("classes.noClasses")}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border bg-muted text-xs font-medium text-muted-foreground">
            <tr>
              <th scope="col" className="w-[24%] px-2 py-3 sm:px-4">
                {t("classes.className")}
              </th>
              <th scope="col" className="w-[18%] px-2 py-3 sm:px-4">
                {t("classes.time")}
              </th>
              <th scope="col" className="w-[18%] px-2 py-3 sm:px-4">
                {t("classes.staff")}
              </th>
              <th scope="col" className="w-[16%] px-2 py-3 sm:px-4">
                {t("classes.repeatOn")}
              </th>
              <th scope="col" className="w-[7%] px-2 py-3 sm:px-4">
                {t("classes.capacity")}
              </th>
              <th scope="col" className="w-[10%] px-2 py-3 sm:px-4">
                {t("classes.status")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-muted-foreground"
                >
                  <span>{t("classes.noFilterMatches")}</span>
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="ml-2 cursor-pointer font-medium text-primary hover:underline"
                  >
                    {t("filters.clear")}
                  </button>
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const isPlaceholder = entry.id === "new-class";
                const scheduleLabel =
                  entry.schedule.type === "recurring"
                    ? entry.schedule.repeatOn
                        .map((weekday) => t(weekdayShortLabelKeys[weekday]))
                        .join(", ")
                    : entry.schedule.date;

                return (
                  <tr
                    key={entry.id}
                    onClick={() => onEditEntry(entry.id)}
                    className="cursor-pointer transition-colors hover:bg-primary/20"
                  >
                    <td className="px-2 py-4 font-semibold text-foreground sm:px-4">
                      {entry.name}
                    </td>
                    <td className="px-2 py-4 font-medium text-foreground sm:px-4">
                      {entry.startTime}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {getInstructorName(entry.instructorId, instructors)}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {scheduleLabel}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {isPlaceholder ? "" : entry.capacity}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {isPlaceholder
                        ? ""
                        : t(classStatusLabelKeys[entry.status])}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
