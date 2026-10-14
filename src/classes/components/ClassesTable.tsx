import type { ClassPlanResponse } from "@/api/class-plans/class-plans.types";
import type { VenueResponse } from "@/api/partners/partners.types";
import { getClassPlanWeekdays } from "@/classes/utils/class-plans.utils";
import { weekdayShortLabelKeys } from "@/config/class-labels";
import { useI18n } from "@/i18n/i18n";
import { dateFromYmdString, formatShortDateWithYear } from "@/lib/date.utils";

export function ClassesTable({
  entries,
  venuesById,
  isFiltering,
  onClearFilters,
}: {
  entries: ClassPlanResponse[];
  venuesById: Map<VenueResponse["id"], VenueResponse>;
  isFiltering: boolean;
  onClearFilters: () => void;
}) {
  const { t, dateLocale } = useI18n();

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
              <th scope="col" className="w-[20%] px-2 py-3 sm:px-4">
                {t("venues.venue")}
              </th>
              <th scope="col" className="w-[10%] px-2 py-3 sm:px-4">
                {t("classes.time")}
              </th>
              <th scope="col" className="w-[20%] px-2 py-3 sm:px-4">
                {t("classes.repeatOn")}
              </th>
              <th scope="col" className="w-[13%] px-2 py-3 text-center sm:px-4">
                {t("classes.totalCapacityColumn")}
              </th>
              <th scope="col" className="w-[13%] px-2 py-3 text-center sm:px-4">
                {t("classes.classistaCapacityColumn")}
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
                const scheduleLabel =
                  entry.recurrenceType === "RECURRING"
                    ? getClassPlanWeekdays(entry)
                        .map((weekday) => t(weekdayShortLabelKeys[weekday]))
                        .join(", ")
                    : formatShortDateWithYear(
                        dateFromYmdString(entry.startDate),
                        dateLocale,
                      );

                return (
                  <tr key={entry.id}>
                    <td className="px-2 py-4 font-semibold text-foreground sm:px-4">
                      {entry.title}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {venuesById.get(entry.venueId)?.name ??
                        t("venues.unknownVenue")}
                    </td>
                    <td className="px-2 py-4 font-medium text-foreground sm:px-4">
                      {entry.startTime}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {scheduleLabel}
                    </td>
                    <td className="px-2 py-4 text-center text-muted-foreground sm:px-4">
                      {entry.totalCapacity}
                    </td>
                    <td className="px-2 py-4 text-center text-muted-foreground sm:px-4">
                      {entry.classistaCapacity}
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
