import { cn } from "@/lib/classnames.utils";
import { useI18n } from "@/i18n/i18n";
import type { ClassListEntry } from "@/types/classes";

export function ClassesTable({
  entries,
  selectedEntryId,
  onSelectEntry,
  isFiltering,
  onClearFilters,
}: {
  entries: ClassListEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  isFiltering: boolean;
  onClearFilters: () => void;
}) {
  const { t } = useI18n();

  if (entries.length === 0 && !isFiltering) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        {t("classes.noClasses")}
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-background">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
          <tr>
            <th scope="col" className="w-[18%] px-2 py-3 sm:px-4">
              {t("classes.time")}
            </th>
            <th scope="col" className="w-[30%] px-2 py-3 sm:px-4">
              {t("classes.className")}
            </th>
            <th scope="col" className="w-[26%] px-2 py-3 sm:px-4">
              {t("classes.staff")}
            </th>
            <th scope="col" className="w-[26%] px-2 py-3 sm:px-4">
              {t("classes.repeatOn")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.length === 0 ? (
            <tr>
              <td
                colSpan={4}
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
              const isSelected = entry.id === selectedEntryId;

              return (
                <tr
                  key={entry.id}
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => onSelectEntry(entry.id)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-primary/20",
                    isSelected && "bg-primary/20",
                  )}
                >
                  <td className="px-2 py-2 font-medium text-foreground sm:px-4">
                    {entry.startTime}
                  </td>
                  <td className="px-2 py-2 font-semibold text-foreground sm:px-4">
                    {entry.className}
                  </td>
                  <td className="px-2 py-2 text-muted-foreground sm:px-4">
                    {entry.instructorName}
                  </td>
                  <td className="px-2 py-2 text-muted-foreground sm:px-4">
                    {entry.repeatOn.join(", ")}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
