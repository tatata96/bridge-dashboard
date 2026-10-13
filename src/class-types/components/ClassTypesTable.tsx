import type { ClassTypeResponse } from "@/api/class-types/class-types.types";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/classnames.utils";

export function ClassTypesTable({
  classTypes,
  emptyMessage,
  isArchived,
}: {
  classTypes: ClassTypeResponse[];
  emptyMessage: string;
  isArchived: boolean;
}) {
  const { t } = useI18n();

  if (classTypes.length === 0) {
    return (
      <div className="flex min-h-24 flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border bg-muted text-xs font-medium text-muted-foreground">
            <tr>
              <th scope="col" className="w-[30%] px-2 py-3 sm:px-4">
                {t("classTypes.name")}
              </th>
              <th scope="col" className="w-[25%] px-2 py-3 sm:px-4">
                {t("classTypes.category")}
              </th>
              <th scope="col" className="w-[45%] px-2 py-3 sm:px-4">
                {t("classTypes.description")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {classTypes.map((classType) => (
              <tr key={classType.id}>
                <td
                  className={cn(
                    "px-2 py-4 font-semibold sm:px-4",
                    isArchived ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {classType.name}
                </td>
                <td className="px-2 py-4 text-muted-foreground sm:px-4">
                  {classType.category.name}
                </td>
                <td className="px-2 py-4 text-muted-foreground sm:px-4">
                  {classType.description ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
