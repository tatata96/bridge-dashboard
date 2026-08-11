import { useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { mockClasses } from "@/classes/data/classes.mock-data";
import { WeekdaySelector } from "@/classes/components/WeekdaySelector";
import { getUniqueClassesByName } from "@/classes/utils/classes.utils";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { NumberStepper } from "@/components/ui/number-stepper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPagePath } from "@/config/navigation";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/i18n";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { ClassSchedule, Weekday } from "@/types/classes";

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

function parseClassDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatTimeLabel(value: string, locale: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ClassFormPage() {
  const { t, dateLocale } = useI18n();
  const { toast } = useToast();
  const { classId } = useParams();
  const classToEdit = useMemo(
    () => mockClasses.find((classItem) => classItem.id === classId) ?? null,
    [classId],
  );
  const isEditMode = Boolean(classId);

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
      ? parseClassDate(
          classToEdit.schedule.type === "one_time"
            ? classToEdit.schedule.date
            : classToEdit.schedule.startDate,
        )
      : new Date(),
  );
  const [endDate, setEndDate] = useState<Date | null>(() =>
    classToEdit?.schedule.type === "recurring" && classToEdit.schedule.endDate
      ? parseClassDate(classToEdit.schedule.endDate)
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
  const [capacity, setCapacity] = useState(() => classToEdit?.capacity ?? 0);
  const dateLabel =
    classType === "one_time" ? t("classes.date") : t("classes.startDate");

  if (isEditMode && !classToEdit) {
    return <Navigate to={getPagePath("classes")} replace />;
  }

  function handleSave() {
    toast({ title: t("toast.classChangesSaved") });
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

        <section className="flex min-h-80 flex-col gap-6 rounded-lg border border-border bg-background p-4 sm:p-6">
          <h2 className="text-base font-semibold text-foreground">
            {isEditMode ? t("classes.editClass") : t("classes.addClass")}
          </h2>

          <div className="grid gap-x-8 gap-y-6 xl:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-6">
              <fieldset className="flex min-w-0 flex-col gap-3">
                <legend className="text-sm font-medium text-muted-foreground">
                  {t("classes.classType")}
                </legend>
                <RadioGroup
                  value={classType}
                  onValueChange={(value) =>
                    setClassType(value as ClassSchedule["type"])
                  }
                  className="flex w-fit grid-cols-none flex-wrap gap-6"
                >
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                    <RadioGroupItem value="recurring" />
                    {t("classes.recurring")}
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                    <RadioGroupItem value="one_time" />
                    {t("classes.oneTime")}
                  </label>
                </RadioGroup>
              </fieldset>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
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
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("classes.endDate")}
                  </span>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    label={t("classes.endDate")}
                    locale={dateLocale}
                    placeholder={t("classes.noEndDate")}
                    clearLabel={t("filters.clear")}
                  />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-2">
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

            {classType === "recurring" && (
              <>
                <fieldset className="flex min-w-0 flex-col gap-2">
                  <legend className="text-sm font-medium text-muted-foreground">
                    {t("classes.repeatOn")}
                  </legend>
                  <WeekdaySelector value={repeatOn} onChange={setRepeatOn} />
                </fieldset>
                <div aria-hidden="true" className="hidden xl:block" />
              </>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
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
                        {formatTimeLabel(time, dateLocale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                {t("classes.durationMinutes")}
                <Input
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(event) =>
                    setDurationMinutes(Number(event.currentTarget.value))
                  }
                />
              </label>
            </div>

            <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
              {t("classes.capacity")}
              <NumberStepper
                value={capacity}
                onChange={setCapacity}
                min={0}
                label={t("classes.capacity")}
                className="w-fit"
              />
            </label>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button type="button" className="h-9" onClick={handleSave}>
              {t("common.save")}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
