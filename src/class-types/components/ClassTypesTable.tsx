import { useRef, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";

import { useArchiveClassTypeMutation } from "@/api/class-types/class-types.api";
import type { ClassTypeResponse } from "@/api/class-types/class-types.types";
import { ClassTypeFormDialog } from "@/class-types/components/ClassTypeFormDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/classnames.utils";
import { ApiError } from "@/lib/network/api-client";

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
  const { toast } = useToast();
  const archiveClassType = useArchiveClassTypeMutation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [classTypeToEdit, setClassTypeToEdit] =
    useState<ClassTypeResponse | null>(null);
  const [classTypeToArchive, setClassTypeToArchive] =
    useState<ClassTypeResponse | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const actionTriggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastActionIdRef = useRef<string | null>(null);

  function closeEditDialog() {
    lastActionIdRef.current = classTypeToEdit?.id ?? null;
    setClassTypeToEdit(null);
  }

  function closeArchiveDialog() {
    lastActionIdRef.current = classTypeToArchive?.id ?? null;
    setClassTypeToArchive(null);
    setArchiveError(null);
  }

  // The menu item that opened a dialog is gone by the time the dialog
  // closes, so send focus back to the row's actions button.
  function restoreActionFocus(event: Event) {
    const classTypeId = lastActionIdRef.current;
    if (!classTypeId) {
      return;
    }
    event.preventDefault();
    actionTriggerRefs.current.get(classTypeId)?.focus();
    lastActionIdRef.current = null;
  }

  async function confirmArchive() {
    if (!classTypeToArchive || archiveClassType.isPending) {
      return;
    }

    setArchiveError(null);
    try {
      await archiveClassType.mutateAsync(classTypeToArchive.id);
    } catch (error) {
      setArchiveError(
        t(
          error instanceof ApiError && error.status === 404
            ? "classTypes.error.notFound"
            : "classTypes.error.archiveFailed",
        ),
      );
      return;
    }

    toast({ title: t("toast.classTypeArchived") });
    closeArchiveDialog();
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
                        <DropdownMenuItem
                          onSelect={() => {
                            setArchiveError(null);
                            setClassTypeToArchive(classType);
                          }}
                        >
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
          onCloseAutoFocus={restoreActionFocus}
        />
      ) : null}
      {classTypeToArchive ? (
        <ConfirmDialog
          open
          onOpenChange={(open) => {
            // Keep the dialog open while the request is in flight.
            if (!open && !archiveClassType.isPending) {
              closeArchiveDialog();
            }
          }}
          title={t("classTypes.archiveTitle")}
          body={t("classTypes.archiveBody", { name: classTypeToArchive.name })}
          cancelLabel={t("common.cancel")}
          confirmLabel={t(
            archiveClassType.isPending
              ? "classTypes.archiving"
              : "classTypes.archiveConfirm",
          )}
          tone="destructive"
          onConfirm={confirmArchive}
          confirmDisabled={archiveClassType.isPending}
          contentProps={{ onCloseAutoFocus: restoreActionFocus }}
        >
          {archiveError ? (
            <p role="alert" className="text-sm text-destructive">
              {archiveError}
            </p>
          ) : null}
        </ConfirmDialog>
      ) : null}
    </div>
  );
}
