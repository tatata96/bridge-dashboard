import { useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { ClassStatusIndicator } from "@/classes/components/ClassStatusIndicator";
import { ClassSessionsCard } from "@/classes/components/ClassSessionsCard";
import { PauseClassPlanDialog } from "@/classes/components/PauseClassPlanDialog";
import { mockClasses } from "@/classes/data/classes.mock-data";
import { WeekdaySelector } from "@/classes/components/WeekdaySelector";
import { getUpcomingSessionSummary } from "@/classes/utils/class-sessions.utils";
import { saveClassStatus } from "@/classes/utils/class-status.utils";
import { getUniqueClassesByName } from "@/classes/utils/classes.utils";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { InfoNotice } from "@/components/ui/info-notice";
import { NumberStepper } from "@/components/ui/number-stepper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  weekdayIndexes,
  weekdayShortLabelKeys,
  weekdays,
} from "@/config/class-labels";
import { getPagePath } from "@/config/navigation";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/i18n";
import {
  addMinutes,
  dateFromTimeString,
  dateFromYmdString,
  formatShortDateWithYear,
  formatTime,
  formatTimeRange,
} from "@/lib/date.utils";
import {
  mockClassSessions,
  mockInstructors,
} from "@/schedule/data/schedule.mock-data";
import type { ClassSchedule, Weekday } from "@/types/classes";

// TODO: make logical time options list
const startTimeOptions = Array.from(
  new Set([
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "18:00",
    ...mockClasses.map((classItem) => classItem.startTime),
  ]),
).sort();
const uniqueClasses = getUniqueClassesByName(mockClasses);
const noStaffValue = "none";
const durationOptions = [30, 45, 60, 75, 90] as const;

function getFirstClassDate(startDate: Date, repeatOn: Weekday[]) {
  if (repeatOn.length === 0) return null;

  const selectedWeekdayIndexes = repeatOn.map((day) => weekdayIndexes[day]);
  const daysUntilNextClass = selectedWeekdayIndexes.reduce(
    (nearestOffset, weekdayIndex) => {
      const offset = (weekdayIndex - startDate.getDay() + 7) % 7;
      return Math.min(nearestOffset, offset);
    },
    6,
  );
  const firstClassDate = new Date(startDate);
  firstClassDate.setDate(startDate.getDate() + daysUntilNextClass);
  return firstClassDate;
}

export function ClassFormPage() {
  const { t, dateLocale } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { classId } = useParams();
  const classToEdit = useMemo(
    () => mockClasses.find((classItem) => classItem.id === classId) ?? null,
    [classId],
  );
  const isEditMode = Boolean(classId);
  const isRecurringClassPlan = classToEdit?.schedule.type === "recurring";
  const isClassTypeLocked = isEditMode;

  const [classType, setClassType] = useState<ClassSchedule["type"]>(
    () => classToEdit?.schedule.type ?? "recurring",
  );
  const [selectedClassId, setSelectedClassId] = useState(
    () => classToEdit?.id ?? uniqueClasses[0]?.id ?? "",
  );
  const [selectedStaffId, setSelectedStaffId] = useState(
    () => classToEdit?.instructorId ?? noStaffValue,
  );
  const [startDate, setStartDate] = useState(() =>
    classToEdit
      ? dateFromYmdString(
          classToEdit.schedule.type === "one_time"
            ? classToEdit.schedule.date
            : classToEdit.schedule.startDate,
        )
      : new Date(),
  );
  const [endDate, setEndDate] = useState<Date | null>(() =>
    classToEdit?.schedule.type === "recurring" && classToEdit.schedule.endDate
      ? dateFromYmdString(classToEdit.schedule.endDate)
      : null,
  );
  const [repeatOn, setRepeatOn] = useState<Weekday[]>(() =>
    classToEdit?.schedule.type === "recurring"
      ? classToEdit.schedule.repeatOn
      : [],
  );
  const [startTime, setStartTime] = useState(
    () => classToEdit?.startTime ?? "07:00",
  );
  const [durationMinutes, setDurationMinutes] = useState(
    () => classToEdit?.durationMinutes ?? 60,
  );
  const [capacity, setCapacity] = useState(() => classToEdit?.capacity ?? 1);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);
  const dateLabel =
    classType === "one_time" ? t("classes.date") : t("classes.startDate");
  const sessionCardClassId = classToEdit?.id ?? selectedClassId;
  const canPauseClass = isEditMode && classToEdit?.status === "active";
  const classTypeOptionClassName = isClassTypeLocked
    ? "flex cursor-not-allowed items-center gap-2 text-sm font-medium text-muted-foreground"
    : "flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground";
  const recurrenceSummary = useMemo(() => {
    if (classType !== "recurring") return null;

    const orderedRepeatOn = weekdays.filter((day) => repeatOn.includes(day));
    if (orderedRepeatOn.length === 0) {
      return { message: t("classes.recurrenceSummaryNoDays") };
    }

    const firstClassDate = getFirstClassDate(startDate, orderedRepeatOn);
    if (!firstClassDate) {
      return { message: t("classes.recurrenceSummaryNoDays") };
    }

    const days = orderedRepeatOn
      .map((day) => t(weekdayShortLabelKeys[day]))
      .join(", ");

    return {
      primary: t("classes.recurrenceSummaryPrimary", {
        days,
        timeRange: formatTimeRange(
          dateFromTimeString(startTime),
          addMinutes(dateFromTimeString(startTime), durationMinutes),
          dateLocale,
        ),
      }),
      secondary: t("classes.recurrenceSummaryDates", {
        startDate: formatShortDateWithYear(firstClassDate, dateLocale),
        endDate: endDate
          ? t("classes.recurrenceSummaryEndDate", {
              endDate: formatShortDateWithYear(endDate, dateLocale),
            })
          : t("classes.recurrenceSummaryNoEndDate"),
      }),
    };
  }, [
    classType,
    dateLocale,
    durationMinutes,
    endDate,
    repeatOn,
    startDate,
    startTime,
    t,
  ]);

  if (isEditMode && !classToEdit) {
    return <Navigate to={getPagePath("classes")} replace />;
  }

  function handleSave() {
    navigate(getPagePath("classes"));
  }

  function handleClassTypeChange(value: string) {
    if (isClassTypeLocked) return;

    setClassType(value as ClassSchedule["type"]);
  }

  function closePauseDialog(open: boolean) {
    setIsPauseDialogOpen(open);
    if (!open) {
      setPauseError(null);
    }
  }

  async function confirmPause() {
    if (!classToEdit) return;

    setIsPausing(true);
    setPauseError(null);

    try {
      await saveClassStatus(classToEdit.id, "paused");
      toast({ title: t("toast.classPaused") });
      navigate(getPagePath("classes"), {
        state: { pausedClassId: classToEdit.id },
      });
    } catch {
      setPauseError(t("classes.pauseError"));
    } finally {
      setIsPausing(false);
    }
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4">
      <div className="flex w-full min-w-0 flex-col gap-4">
        <Button asChild variant="ghost" className="h-9 w-fit">
          <Link to={getPagePath("classes")}>
            <ArrowLeftIcon data-icon="inline-start" />
            {t("classes.backToClasses")}
          </Link>
        </Button>

        <div className="grid w-full max-w-7xl items-start gap-4 xl:grid-cols-[minmax(0,60rem)_minmax(18rem,22rem)]">
          <section className="min-h-80 w-full rounded-lg border border-border bg-background p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-foreground">
                {isEditMode ? t("classes.editClass") : t("classes.addClass")}
              </h2>
              {classToEdit ? (
                <ClassStatusIndicator
                  status={classToEdit.status}
                  label={t(
                    classToEdit.status === "active"
                      ? "classes.active"
                      : "classes.paused",
                  )}
                />
              ) : null}
            </div>

            {isEditMode && isRecurringClassPlan && (
              <InfoNotice className="mt-8">
                <p>
                  {t("classes.editAppliesToAll")}{" "}
                  {t("classes.editSingleClassPrefix")}
                  <Link
                    to={getPagePath("schedule")}
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    {t("classes.editSingleClassLink")}
                  </Link>
                  {t("classes.editSingleClassSuffix")}
                </p>
              </InfoNotice>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-6">
                <fieldset className="flex min-w-0 flex-col gap-4">
                  <legend className="text-sm font-medium text-muted-foreground">
                    {t("classes.classType")}
                  </legend>
                  <RadioGroup
                    value={classType}
                    onValueChange={handleClassTypeChange}
                    disabled={isClassTypeLocked}
                    className="flex w-fit grid-cols-none flex-wrap gap-6"
                  >
                    <label className={classTypeOptionClassName}>
                      <RadioGroupItem value="recurring" />
                      {t("classes.recurring")}
                    </label>
                    <label className={classTypeOptionClassName}>
                      <RadioGroupItem value="one_time" />
                      {t("classes.oneTime")}
                    </label>
                  </RadioGroup>
                </fieldset>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex min-w-0 flex-col gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {dateLabel}
                    </span>
                    <DatePicker
                      value={startDate}
                      onChange={(date) => {
                        if (date) {
                          setStartDate(date);
                        }
                      }}
                      label={dateLabel}
                      locale={dateLocale}
                    />
                  </div>

                  {classType === "recurring" && (
                    <div className="flex min-w-0 flex-col gap-4">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          {t("classes.endDate")}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {t("classes.optional")}
                        </span>
                      </span>
                      <DatePicker
                        value={endDate}
                        onChange={setEndDate}
                        label={t("classes.endDate")}
                        locale={dateLocale}
                        placeholder={t("classes.noEndDate")}
                        clearLabel={t("filters.clear")}
                        mutedPlaceholder={false}
                      />
                    </div>
                  )}
                </div>

                {classType === "recurring" && (
                  <fieldset className="flex min-w-0 flex-col gap-4">
                    <legend className="text-sm font-medium text-muted-foreground">
                      {t("classes.repeatOn")}
                    </legend>
                    <WeekdaySelector value={repeatOn} onChange={setRepeatOn} />
                    {recurrenceSummary ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {"message" in recurrenceSummary ? (
                          recurrenceSummary.message
                        ) : (
                          <>
                            <span className="block">
                              {recurrenceSummary.primary}
                            </span>
                            <span className="block">
                              {recurrenceSummary.secondary}
                            </span>
                          </>
                        )}
                      </p>
                    ) : null}
                  </fieldset>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex min-w-0 flex-col gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("classes.startTime")}
                    </span>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {startTimeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(dateFromTimeString(time), dateLocale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("classes.durationMinutes")}
                    </span>
                    <Select
                      value={String(durationMinutes)}
                      onValueChange={(value) =>
                        setDurationMinutes(Number(value))
                      }
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((duration) => (
                          <SelectItem key={duration} value={String(duration)}>
                            {duration} {t("schedule.minuteShort")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-6">
                <div className="flex min-w-0 flex-col gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("classes.class")}
                  </span>
                  <Select
                    value={selectedClassId}
                    onValueChange={setSelectedClassId}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueClasses.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("classes.staff")}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {t("classes.optional")}
                    </span>
                  </span>
                  <Select
                    value={selectedStaffId}
                    onValueChange={setSelectedStaffId}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={noStaffValue}>
                        {t("class.noStaff")}
                      </SelectItem>
                      {mockInstructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <label className="flex min-w-0 flex-col gap-4 text-sm font-medium text-muted-foreground">
                  {t("classes.capacity")}
                  <NumberStepper
                    value={capacity}
                    onChange={setCapacity}
                    min={1}
                    label={t("classes.capacity")}
                    className="w-fit"
                  />
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-2 border-t border-border pt-4">
              {canPauseClass ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-9"
                  onClick={() => {
                    setPauseError(null);
                    setIsPauseDialogOpen(true);
                  }}
                >
                  {t("classes.pause")}
                </Button>
              ) : null}
              <Button type="button" className="h-9" onClick={handleSave}>
                {t("common.save")}
              </Button>
            </div>
          </section>

          <ClassSessionsCard classId={sessionCardClassId} />
        </div>
      </div>
      {classToEdit && canPauseClass ? (
        <PauseClassPlanDialog
          entry={classToEdit}
          open={isPauseDialogOpen}
          onOpenChange={closePauseDialog}
          summary={getUpcomingSessionSummary(mockClassSessions, classToEdit.id)}
          isPausing={isPausing}
          pauseError={pauseError}
          onConfirm={confirmPause}
        />
      ) : null}
    </main>
  );
}
