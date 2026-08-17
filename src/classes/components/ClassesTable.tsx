import { useRef, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";

import {
  PauseClassPlanDialog,
  type UpcomingSessionSummary,
} from "@/classes/components/PauseClassPlanDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { weekdayShortLabelKeys } from "@/config/class-labels";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/classnames.utils";
import type { ClassStatus } from "@/types/classes";
import type { ClassPlan } from "@/types/classes";
import type { Instructor } from "@/types/schedule";

function getInstructorName(
  instructorId: string | null,
  instructors: Instructor[],
  noInstructorLabel: string,
  unknownInstructorLabel: string,
) {
  if (!instructorId) return noInstructorLabel;
  return (
    instructors.find((instructor) => instructor.id === instructorId)?.name ??
    unknownInstructorLabel
  );
}

function StatusIcon({ status, label }: { status: ClassStatus; label: string }) {
  return (
    <span
      title={label}
      aria-hidden="true"
      className={cn(
        "block size-2 rounded-full",
        status === "active"
          ? "bg-muted-foreground"
          : "border border-muted-foreground",
      )}
    />
  );
}

export function ClassesTable({
  entries,
  instructors,
  onEditEntry,
  onPauseEntry,
  onActivateEntry,
  getUpcomingSessionSummary,
  isFiltering,
  onClearFilters,
}: {
  entries: ClassPlan[];
  instructors: Instructor[];
  onEditEntry: (entryId: string) => void;
  onPauseEntry: (entryId: string) => Promise<void>;
  onActivateEntry: (entryId: string) => void;
  getUpcomingSessionSummary: (entryId: string) => UpcomingSessionSummary;
  isFiltering: boolean;
  onClearFilters: () => void;
}) {
  const { t } = useI18n();
  const [openMenuEntryId, setOpenMenuEntryId] = useState<string | null>(null);
  const [entryToPause, setEntryToPause] = useState<ClassPlan | null>(null);
  const [isPausing, setIsPausing] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);
  const actionTriggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastPauseEntryIdRef = useRef<string | null>(null);

  function closePauseDialog(open: boolean) {
    if (open) return;
    lastPauseEntryIdRef.current = entryToPause?.id ?? null;
    setEntryToPause(null);
    setPauseError(null);
  }

  async function confirmPause() {
    if (!entryToPause) return;

    setIsPausing(true);
    setPauseError(null);

    try {
      await onPauseEntry(entryToPause.id);
      lastPauseEntryIdRef.current = entryToPause.id;
      setEntryToPause(null);
    } catch {
      setPauseError(t("classes.pauseError"));
    } finally {
      setIsPausing(false);
    }
  }

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
              <th scope="col" className="w-[17%] px-2 py-3 sm:px-4">
                {t("classes.repeatOn")}
              </th>
              <th scope="col" className="w-[7%] px-2 py-3 sm:px-4">
                {t("classes.capacity")}
              </th>
              <th scope="col" className="w-[10%] px-2 py-3 sm:px-4">
                {t("classes.status")}
              </th>
              <th scope="col" className="w-[6%] px-2 py-3 text-right sm:px-3">
                <span className="sr-only">{t("classes.actions")}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                const isPaused = entry.status === "paused";
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
                    <td
                      className={cn(
                        "px-2 py-4 font-semibold sm:px-4",
                        isPaused ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {entry.name}
                    </td>
                    <td
                      className={cn(
                        "px-2 py-4 font-medium sm:px-4",
                        isPaused ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {entry.startTime}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {getInstructorName(
                        entry.instructorId,
                        instructors,
                        t("classes.noInstructorAssigned"),
                        t("classes.unknownInstructor"),
                      )}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {scheduleLabel}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {isPlaceholder ? "" : entry.capacity}
                    </td>
                    <td className="px-2 py-4 text-muted-foreground sm:px-4">
                      {isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-2">
                          <StatusIcon
                            status={entry.status}
                            label={t(
                              entry.status === "active"
                                ? "classes.active"
                                : "classes.paused",
                            )}
                          />
                          {t(
                            entry.status === "active"
                              ? "classes.active"
                              : "classes.paused",
                          )}
                        </span>
                      )}
                    </td>
                    <td
                      className="px-2 py-4 text-right sm:px-3"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {!isPlaceholder && (
                        <DropdownMenu
                          open={openMenuEntryId === entry.id}
                          onOpenChange={(open) =>
                            setOpenMenuEntryId(open ? entry.id : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              ref={(node) => {
                                if (node) {
                                  actionTriggerRefs.current.set(entry.id, node);
                                } else {
                                  actionTriggerRefs.current.delete(entry.id);
                                }
                              }}
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t("classes.entryActions", {
                                name: entry.name,
                              })}
                              aria-haspopup="menu"
                              aria-expanded={openMenuEntryId === entry.id}
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => onEditEntry(entry.id)}
                            >
                              {t("classes.editClass")}
                            </DropdownMenuItem>
                            {entry.status === "active" ? (
                              <DropdownMenuItem
                                onSelect={() => {
                                  setPauseError(null);
                                  setEntryToPause(entry);
                                }}
                              >
                                {t("classes.pause")}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onSelect={() => onActivateEntry(entry.id)}
                              >
                                {t("classes.activate")}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {entryToPause ? (
        <PauseClassPlanDialog
          entry={entryToPause}
          open={Boolean(entryToPause)}
          onOpenChange={closePauseDialog}
          summary={getUpcomingSessionSummary(entryToPause.id)}
          isPausing={isPausing}
          pauseError={pauseError}
          onConfirm={confirmPause}
          contentProps={{
            onCloseAutoFocus: (event) => {
              const entryId = lastPauseEntryIdRef.current;
              if (!entryId) return;
              event.preventDefault();
              actionTriggerRefs.current.get(entryId)?.focus();
              lastPauseEntryIdRef.current = null;
            },
          }}
        />
      ) : null}
    </div>
  );
}
