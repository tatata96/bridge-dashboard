import { useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useClassTypesQuery } from "@/api/class-types/class-types.api";
import { useVenuesQuery } from "@/api/venues/venues.api";
import { mockClassPlans } from "@/classes/data/classes.mock-data";
import { WeekdaySelector } from "@/classes/components/WeekdaySelector";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import { useI18n } from "@/i18n/i18n";
import {
  addMinutes,
  dateFromTimeString,
  formatShortDateWithYear,
  formatTime,
  formatTimeRange,
  formatYmd,
} from "@/lib/date.utils";
import type { ClassPlan, ClassSchedule, Weekday } from "@/types/classes";

// TODO: make logical time options list
const startTimeOptions = Array.from(
  new Set([
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "18:00",
    ...mockClassPlans.map((classPlan) => classPlan.startTime),
  ]),
).sort();
const noStaffValue = "none";
const durationOptions = [30, 45, 60, 75, 90] as const;

type FormErrors = {
  repeatOn?: string;
  endDate?: string;
};

function withoutFormError(errors: FormErrors, key: keyof FormErrors) {
  return Object.fromEntries(
    Object.entries(errors).filter(([errorKey]) => errorKey !== key),
  ) as FormErrors;
}

function getFirstClassDate(startDate: Date, repeatOn: Weekday[]) {
  if (repeatOn.length === 0) {
    return null;
  }

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
  const navigate = useNavigate();
  const classTypesQuery = useClassTypesQuery("active");
  const venuesQuery = useVenuesQuery();
  const classTypeOptions = classTypesQuery.data ?? [];
  const venueOptions = venuesQuery.data ?? [];
  const isClassTypeSelectDisabled = classTypeOptions.length === 0;
  const isVenueSelectDisabled = venueOptions.length === 0;

  const [classType, setClassType] =
    useState<ClassSchedule["type"]>("recurring");
  const [selectedClassTypeId, setSelectedClassTypeId] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  // TODO: replace with a real selection once the instructors API is connected.
  const [selectedStaffId] = useState(noStaffValue);
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [repeatOn, setRepeatOn] = useState<Weekday[]>([]);
  const [startTime, setStartTime] = useState("07:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [capacity, setCapacity] = useState(1);
  // Saving needs a real class type and venue chosen from the loaded options.
  const isSaveDisabled =
    !classTypeOptions.some((option) => option.id === selectedClassTypeId) ||
    !venueOptions.some((option) => option.id === selectedVenueId);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const dateLabel =
    classType === "one_time" ? t("classes.date") : t("classes.startDate");
  const recurrenceSummary = useMemo(() => {
    if (classType !== "recurring") {
      return null;
    }

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

  function handleSave() {
    const nextErrors: FormErrors = {};

    if (classType === "recurring") {
      if (repeatOn.length === 0) {
        nextErrors.repeatOn = t("classes.repeatOnRequired");
      }

      if (endDate && formatYmd(endDate) < formatYmd(startDate)) {
        nextErrors.endDate = t("classes.endDateBeforeStartDate");
      }
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const savedClassPlan: ClassPlan = {
      id: `class-${Date.now()}`,
      classTypeId: selectedClassTypeId,
      venueId: selectedVenueId,
      status: "active",
      instructorId: selectedStaffId === noStaffValue ? null : selectedStaffId,
      schedule:
        classType === "one_time"
          ? {
              type: "one_time",
              date: formatYmd(startDate),
            }
          : {
              type: "recurring",
              repeatOn,
              startDate: formatYmd(startDate),
              endDate: endDate ? formatYmd(endDate) : null,
            },
      startTime,
      durationMinutes,
      capacity,
    };

    navigate(getPagePath("classes"), { state: { savedClassPlan } });
  }

  function handleClassTypeChange(value: string) {
    setClassType(value as ClassSchedule["type"]);
    setFormErrors({});
  }

  function handleStartDateChange(date: Date | null) {
    if (!date) {
      return;
    }

    setStartDate(date);
    setFormErrors((currentErrors) => {
      if (
        !currentErrors.endDate ||
        (endDate && formatYmd(endDate) < formatYmd(date))
      ) {
        return currentErrors;
      }

      return withoutFormError(currentErrors, "endDate");
    });
  }

  function handleEndDateChange(date: Date | null) {
    setEndDate(date);
    setFormErrors((currentErrors) => {
      if (
        !currentErrors.endDate ||
        (date && formatYmd(date) < formatYmd(startDate))
      ) {
        return currentErrors;
      }

      return withoutFormError(currentErrors, "endDate");
    });
  }

  function handleRepeatOnChange(value: Weekday[]) {
    setRepeatOn(value);
    setFormErrors((currentErrors) => {
      if (!currentErrors.repeatOn || value.length === 0) {
        return currentErrors;
      }

      return withoutFormError(currentErrors, "repeatOn");
    });
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
                {t("classes.addClass")}
              </h2>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="order-2 flex min-w-0 flex-col gap-6">
                <fieldset className="flex min-w-0 flex-col gap-4">
                  <legend className="text-sm font-medium text-muted-foreground">
                    {t("classes.classType")}
                  </legend>
                  <RadioGroup
                    value={classType}
                    onValueChange={handleClassTypeChange}
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

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex min-w-0 flex-col gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {dateLabel}
                    </span>
                    <DatePicker
                      value={startDate}
                      onChange={handleStartDateChange}
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
                        onChange={handleEndDateChange}
                        label={t("classes.endDate")}
                        locale={dateLocale}
                        placeholder={t("classes.noEndDate")}
                        clearLabel={t("filters.clear")}
                        mutedPlaceholder={false}
                      />
                      {formErrors.endDate ? (
                        <p className="text-sm font-medium text-destructive">
                          {formErrors.endDate}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>

                {classType === "recurring" && (
                  <fieldset className="flex min-w-0 flex-col gap-4">
                    <legend className="text-sm font-medium text-muted-foreground">
                      {t("classes.repeatOn")}
                    </legend>
                    <WeekdaySelector
                      value={repeatOn}
                      onChange={handleRepeatOnChange}
                    />
                    {formErrors.repeatOn ? (
                      <p className="text-sm font-medium text-destructive">
                        {formErrors.repeatOn}
                      </p>
                    ) : null}
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

              <div className="order-1 flex min-w-0 flex-col gap-6">
                <div className="flex min-w-0 flex-col gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("classes.class")}
                  </span>
                  <Select
                    value={selectedClassTypeId}
                    onValueChange={setSelectedClassTypeId}
                    disabled={isClassTypeSelectDisabled}
                  >
                    <SelectTrigger
                      aria-label={t("classes.selectClassType")}
                      className="h-9 w-full"
                    >
                      <SelectValue placeholder={t("classes.selectClassType")} />
                    </SelectTrigger>
                    <SelectContent>
                      {classTypeOptions.map((classType) => (
                        <SelectItem key={classType.id} value={classType.id}>
                          {classType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("venues.venue")}
                  </span>
                  <Select
                    value={selectedVenueId}
                    onValueChange={setSelectedVenueId}
                    disabled={isVenueSelectDisabled}
                  >
                    <SelectTrigger
                      aria-label={t("venues.selectVenue")}
                      className="h-9 w-full"
                    >
                      <SelectValue placeholder={t("venues.selectVenue")} />
                    </SelectTrigger>
                    <SelectContent>
                      {venueOptions.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* TODO: re-enable once the instructors API is connected.
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
                        {t("classes.noInstructor")}
                      </SelectItem>
                      {mockInstructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                */}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                className="h-9"
                onClick={handleSave}
                disabled={isSaveDisabled}
              >
                {t("common.save")}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
