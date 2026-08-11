import { useState } from "react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { mockClasses } from "@/classes/data/classes.mock-data";
import { WeekdaySelector } from "@/classes/components/WeekdaySelector";
import { getUniqueClassesByName } from "@/classes/utils/classes.utils";
import { Button } from "@/components/ui/button";
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
import { useI18n } from "@/i18n/i18n";
import { addDays, formatShortDate } from "@/lib/date.utils";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { ClassSchedule, Weekday } from "@/types/classes";

const startTimeOptions = ["07:00", "08:00", "09:00", "10:00", "18:00"];
const uniqueClasses = getUniqueClassesByName(mockClasses);
const noStaffValue = "none";

function formatTimeLabel(value: string, locale: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function AddClassPage() {
  const { t, dateLocale } = useI18n();
  const [classType, setClassType] =
    useState<ClassSchedule["type"]>("recurring");
  const [selectedClassId, setSelectedClassId] = useState(
    uniqueClasses[0]?.id ?? "",
  );
  const [selectedStaffId, setSelectedStaffId] = useState(noStaffValue);
  const [startDate, setStartDate] = useState(() => new Date());
  const [hasNoEndDate, setHasNoEndDate] = useState(true);
  const [repeatOn, setRepeatOn] = useState<Weekday[]>([]);
  const [startTime, setStartTime] = useState("07:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [capacity, setCapacity] = useState(0);
  const dateLabel =
    classType === "one_time" ? t("classes.date") : t("classes.startDate");

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
            {t("classes.addClass")}
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
              <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                {dateLabel}
                <div className="flex h-9 w-fit items-center rounded-4xl border border-input bg-input/30">
                  <span className="min-w-36 px-3 text-center text-sm font-medium text-foreground">
                    {formatShortDate(startDate, dateLocale)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("classes.previousStartDate")}
                    onClick={() => setStartDate((date) => addDays(date, -1))}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("classes.nextStartDate")}
                    onClick={() => setStartDate((date) => addDays(date, 1))}
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>
              </label>

              {classType === "recurring" && (
                <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                  {t("classes.endDate")}
                  <span className="flex h-9 items-center gap-2 text-sm font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={hasNoEndDate}
                      onChange={(event) =>
                        setHasNoEndDate(event.currentTarget.checked)
                      }
                      className="size-4 rounded border-input accent-primary"
                    />
                    {t("classes.noEndDate")}
                  </span>
                </label>
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

            <div>
              {classType === "recurring" && (
                <Button type="button" variant="ghost" className="h-9 w-fit">
                  <PlusIcon data-icon="inline-start" />
                  {t("classes.addMoreStartTimes")}
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
