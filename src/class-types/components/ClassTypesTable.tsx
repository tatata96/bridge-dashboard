import { useRef, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";

import type { ClassTypeResponse } from "@/api/class-types/class-types.types";
import { ClassTypeFormDialog } from "@/class-types/components/ClassTypeFormDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [classTypeToEdit, setClassTypeToEdit] =
    useState<ClassTypeResponse | null>(null);
  const actionTriggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastEditedIdRef = useRef<string | null>(null);

  function closeEditDialog() {
    lastEditedIdRef.current = classTypeToEdit?.id ?? null;
    setClassTypeToEdit(null);
  }

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
              <th scope="col" className="px-2 py-3 sm:px-4">
                {t("classTypes.description")}
              </th>
              {/* Archived types are read-only, so they have no actions. */}
              {isArchived ? null : (
                <th scope="col" className="w-[6%] px-2 py-3 text-right sm:px-3">
                  <span className="sr-only">{t("classTypes.actions")}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {classTypes.map((classType) => (
              <tr
                key={classType.id}
                onClick={
                  isArchived ? undefined : () => setClassTypeToEdit(classType)
                }
                className={cn(
                  !isArchived &&
                    "cursor-pointer transition-colors hover:bg-primary/20",
                )}
              >
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
                {isArchived ? null : (
                  <td
                    className="px-2 py-4 text-right sm:px-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <DropdownMenu
                      open={openMenuId === classType.id}
                      onOpenChange={(open) =>
                        setOpenMenuId(open ? classType.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          ref={(node) => {
                            if (node) {
                              actionTriggerRefs.current.set(classType.id, node);
                            } else {
                              actionTriggerRefs.current.delete(classType.id);
                            }
                          }}
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("classTypes.entryActions", {
                            name: classType.name,
                          })}
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === classType.id}
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => setClassTypeToEdit(classType)}
                        >
                          {t("classTypes.edit")}
                        </DropdownMenuItem>
                        {/* TODO: enable when archiving is connected. */}
                        <DropdownMenuItem disabled>
                          {t("classTypes.archive")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {classTypeToEdit ? (
        <ClassTypeFormDialog
          classType={classTypeToEdit}
          onClose={closeEditDialog}
          onSaved={closeEditDialog}
          // The menu item that opened the dialog is gone by the time it
          // closes, so send focus back to the row's actions button.
          onCloseAutoFocus={(event) => {
            const classTypeId = lastEditedIdRef.current;
            if (!classTypeId) {
              return;
            }
            event.preventDefault();
            actionTriggerRefs.current.get(classTypeId)?.focus();
            lastEditedIdRef.current = null;
          }}
        />
      ) : null}
    </div>
  );
}
