import { useState } from "react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { mockClasses } from "@/classes/data/classes.mock-data";
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
import { weekdayShortLabelKeys } from "@/config/class-labels";
import { getPagePath } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
import { addDays, formatShortDate } from "@/lib/date.utils";
import { cn } from "@/lib/classnames.utils";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { ClassSchedule, Weekday } from "@/types/classes";

const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const startTimeOptions = ["07:00", "08:00", "09:00", "10:00", "18:00"];
const uniqueClasses = getUniqueClassesByName(mockClasses);

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
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState(() => new Date());
  const [hasNoEndDate, setHasNoEndDate] = useState(true);
  const [repeatOn, setRepeatOn] = useState<Weekday[]>([]);
  const [startTime, setStartTime] = useState("07:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [capacity, setCapacity] = useState(0);

  function toggleRepeatDay(day: Weekday) {
    setRepeatOn((current) =>
      current.includes(day)
        ? current.filter((selectedDay) => selectedDay !== day)
        : [...current, day],
    );
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
            {t("classes.addClass")}
          </h2>

          <div className="grid gap-8 xl:grid-cols-2">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                  {t("classes.startDate")}
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
              </div>

              <fieldset className="flex min-w-0 flex-col gap-2">
                <legend className="text-sm font-medium text-muted-foreground">
                  {t("classes.repeatOn")}
                </legend>
                <div className="grid grid-cols-7 overflow-hidden rounded-md border border-input bg-input/30">
                  {weekdays.map((day) => {
                    const isSelected = repeatOn.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleRepeatDay(day)}
                        className={cn(
                          "flex h-9 min-w-0 items-center justify-center border-r border-border px-2 text-sm font-medium text-foreground transition-colors last:border-r-0 hover:bg-input/50 focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                          isSelected && "bg-primary text-primary-foreground",
                        )}
                      >
                        {t(weekdayShortLabelKeys[day])}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                  {t("classes.startTime")}
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="w-full">
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
                </label>

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

              <Button type="button" variant="ghost" className="h-9 w-fit">
                <PlusIcon data-icon="inline-start" />
                {t("classes.addMoreStartTimes")}
              </Button>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                {t("classes.class")}
                <Select
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("classes.selectClass")} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueClasses.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                <span className="flex items-center justify-between gap-3">
                  {t("classes.staff")}
                  <span className="text-xs font-normal">
                    {t("classes.optional")}
                  </span>
                </span>
                <Select
                  value={selectedStaffId}
                  onValueChange={setSelectedStaffId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("classes.selectStaff")} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInstructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-2">
                  {t("classes.capacity")}
                  <span className="text-xs font-normal">
                    {t("classes.optional")}
                  </span>
                </span>
                <NumberStepper
                  value={capacity}
                  onChange={setCapacity}
                  min={0}
                  label={t("classes.capacity")}
                  className="w-fit"
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
