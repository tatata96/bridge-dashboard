import { useId, useMemo, useState, type SubmitEvent } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCreateClassPlanMutation } from "@/api/class-plans/class-plans.api";
import { useClassTypesQuery } from "@/api/class-types/class-types.api";
import { useVenuesQuery } from "@/api/venues/venues.api";
import { WeekdaySelector } from "@/classes/components/WeekdaySelector";
import {
  buildCreateClassPlanRequest,
  endsByMidnight,
  isPositiveInteger,
} from "@/classes/utils/class-plans.utils";
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
import { useToast } from "@/hooks/use-toast";
import { useI18n, type TranslationKey } from "@/i18n/i18n";
import {
  addMinutes,
  dateFromTimeString,
  formatShortDateWithYear,
  formatTime,
  formatTimeRange,
  formatYmd,
  getTodayInTimeZone,
  ISTANBUL_TIME_ZONE,
} from "@/lib/date.utils";
import { ApiError } from "@/lib/network/api-client";
import type { ClassSchedule, Weekday } from "@/types/classes";

// Every half hour of the day, as "HH:mm".
const startTimeOptions = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});
const durationOptions = [30, 45, 60, 75, 90] as const;

type FormErrors = {
  startDate?: string;
  repeatOn?: string;
  endDate?: string;
  endTime?: string;
  totalCapacity?: string;
  classistaCapacity?: string;
};

function getSubmitErrorKey(error: unknown): TranslationKey {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "classes.error.invalid";
    }
    if (error.status === 404) {
      return "classes.error.notFound";
    }
  }

  return "classes.error.generic";
}

// Explains why a dropdown has nothing to pick yet: loading, failed (with
// retry), or the partner has no options. Renders nothing once options exist.
function OptionsStatus({
  isPending,
  isError,
  isEmpty,
  loadingMessage,
  errorMessage,
  emptyMessage,
  onRetry,
}: {
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingMessage: string;
  errorMessage: string;
  emptyMessage: string;
  onRetry: () => void;
}) {
  const { t } = useI18n();

  if (isPending) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {loadingMessage}
      </p>
    );
  }

  if (isError) {
    return (
      <p
        role="alert"
        className="flex flex-wrap items-center gap-x-2 text-sm text-destructive"
      >
        {errorMessage}
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer font-medium underline underline-offset-4"
        >
          {t("auth.retry")}
        </button>
      </p>
    );
  }

  if (isEmpty) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return null;
}

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
  const { toast } = useToast();
  const formId = useId();
  const navigate = useNavigate();
  const createClassPlan = useCreateClassPlanMutation();
  const classTypesQuery = useClassTypesQuery("active");
  const venuesQuery = useVenuesQuery();
  const classTypeOptions = classTypesQuery.data ?? [];
  const venueOptions = venuesQuery.data ?? [];
  const isClassTypeSelectDisabled = classTypeOptions.length === 0;
  const isVenueSelectDisabled = venueOptions.length === 0;
  const isSaving = createClassPlan.isPending;

  const [classType, setClassType] =
    useState<ClassSchedule["type"]>("recurring");
  const [selectedClassTypeId, setSelectedClassTypeId] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [startDate, setStartDate] = useState(() =>
    getTodayInTimeZone(ISTANBUL_TIME_ZONE),
  );
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [repeatOn, setRepeatOn] = useState<Weekday[]>([]);
  const [startTime, setStartTime] = useState("07:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [totalCapacity, setTotalCapacity] = useState(1);
  const [classistaCapacity, setClassistaCapacity] = useState(1);
  // Saving needs a real class type and venue chosen from the loaded options,
  // and a recurring plan needs at least one repeat day.
  const isSaveDisabled =
    !classTypeOptions.some((option) => option.id === selectedClassTypeId) ||
    !venueOptions.some((option) => option.id === selectedVenueId) ||
    (classType === "recurring" && repeatOn.length === 0);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || isSaveDisabled) {
      return;
    }

    const nextErrors: FormErrors = {};

    // Re-checked here because the page may have stayed open past midnight.
    if (
      formatYmd(startDate) < formatYmd(getTodayInTimeZone(ISTANBUL_TIME_ZONE))
    ) {
      nextErrors.startDate = t("classes.startDateInPast");
    }

    if (classType === "recurring") {
      if (repeatOn.length === 0) {
        nextErrors.repeatOn = t("classes.repeatOnRequired");
      }

      if (endDate && formatYmd(endDate) < formatYmd(startDate)) {
        nextErrors.endDate = t("classes.endDateBeforeStartDate");
      }
    }

    if (!endsByMidnight(startTime, durationMinutes)) {
      nextErrors.endTime = t("classes.endsAfterMidnight");
    }

    if (!isPositiveInteger(totalCapacity)) {
      nextErrors.totalCapacity = t("classes.capacityInvalid");
    }

    if (!isPositiveInteger(classistaCapacity)) {
      nextErrors.classistaCapacity = t("classes.capacityInvalid");
    } else if (classistaCapacity > totalCapacity) {
      nextErrors.classistaCapacity = t("classes.classistaCapacityExceedsTotal");
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitError(null);
    try {
      await createClassPlan.mutateAsync(
        buildCreateClassPlanRequest({
          recurrence: classType,
          classTypeId: selectedClassTypeId,
          venueId: selectedVenueId,
          startDate,
          endDate,
          repeatOn,
          startTime,
          durationMinutes,
          totalCapacity,
          classistaCapacity,
        }),
      );
    } catch (error) {
      // The draft stays as it is so the user can retry.
      setSubmitError(t(getSubmitErrorKey(error)));
      return;
    }

    toast({ title: t("toast.classPlanCreated") });
    navigate(getPagePath("classes"));
  }

  function clearFormError(key: keyof FormErrors) {
    setFormErrors((currentErrors) => withoutFormError(currentErrors, key));
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
    clearFormError("startDate");
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

            <form onSubmit={handleSave} noValidate>
              <fieldset
                disabled={isSaving}
                className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2"
              >
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
                        invalid={Boolean(formErrors.startDate)}
                        describedBy={
                          formErrors.startDate
                            ? `${formId}-startDate`
                            : undefined
                        }
                        minDate={getTodayInTimeZone(ISTANBUL_TIME_ZONE)}
                        locale={dateLocale}
                      />
                      {formErrors.startDate ? (
                        <p
                          id={`${formId}-startDate`}
                          className="text-sm font-medium text-destructive"
                        >
                          {formErrors.startDate}
                        </p>
                      ) : null}
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
                          minDate={startDate}
                          invalid={Boolean(formErrors.endDate)}
                          describedBy={
                            formErrors.endDate ? `${formId}-endDate` : undefined
                          }
                          locale={dateLocale}
                          placeholder={t("classes.noEndDate")}
                          clearLabel={t("filters.clear")}
                          mutedPlaceholder={false}
                        />
                        {formErrors.endDate ? (
                          <p
                            id={`${formId}-endDate`}
                            className="text-sm font-medium text-destructive"
                          >
                            {formErrors.endDate}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {classType === "recurring" && (
                    <fieldset
                      aria-describedby={
                        formErrors.repeatOn ? `${formId}-repeatOn` : undefined
                      }
                      className="flex min-w-0 flex-col gap-4"
                    >
                      <legend className="text-sm font-medium text-muted-foreground">
                        {t("classes.repeatOn")}
                      </legend>
                      <WeekdaySelector
                        value={repeatOn}
                        onChange={handleRepeatOnChange}
                      />
                      {formErrors.repeatOn ? (
                        <p
                          id={`${formId}-repeatOn`}
                          className="text-sm font-medium text-destructive"
                        >
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
                      <Select
                        value={startTime}
                        onValueChange={(value) => {
                          setStartTime(value);
                          clearFormError("endTime");
                        }}
                      >
                        <SelectTrigger
                          aria-label={t("classes.startTime")}
                          aria-invalid={Boolean(formErrors.endTime)}
                          aria-describedby={
                            formErrors.endTime ? `${formId}-endTime` : undefined
                          }
                          className="h-9 w-full"
                        >
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
                        onValueChange={(value) => {
                          setDurationMinutes(Number(value));
                          clearFormError("endTime");
                        }}
                      >
                        <SelectTrigger
                          aria-label={t("classes.durationMinutes")}
                          aria-invalid={Boolean(formErrors.endTime)}
                          aria-describedby={
                            formErrors.endTime ? `${formId}-endTime` : undefined
                          }
                          className="h-9 w-full"
                        >
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

                  {formErrors.endTime ? (
                    <p
                      id={`${formId}-endTime`}
                      className="-mt-3 text-sm font-medium text-destructive"
                    >
                      {formErrors.endTime}
                    </p>
                  ) : null}
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
                        <SelectValue
                          placeholder={t("classes.selectClassType")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {classTypeOptions.map((classType) => (
                          <SelectItem key={classType.id} value={classType.id}>
                            {classType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <OptionsStatus
                      isPending={classTypesQuery.isPending}
                      isError={classTypesQuery.isError && !classTypesQuery.data}
                      isEmpty={
                        classTypesQuery.isSuccess &&
                        classTypesQuery.data.length === 0
                      }
                      loadingMessage={t("classTypes.loading")}
                      errorMessage={t("classTypes.loadError")}
                      emptyMessage={t("classes.noClassTypesAvailable")}
                      onRetry={() => void classTypesQuery.refetch()}
                    />
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
                    <OptionsStatus
                      isPending={venuesQuery.isPending}
                      isError={venuesQuery.isError && !venuesQuery.data}
                      isEmpty={
                        venuesQuery.isSuccess && venuesQuery.data.length === 0
                      }
                      loadingMessage={t("classes.loadingVenues")}
                      errorMessage={t("classes.venuesLoadError")}
                      emptyMessage={t("classes.noVenuesAvailable")}
                      onRetry={() => void venuesQuery.refetch()}
                    />
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex min-w-0 flex-col gap-4">
                      <label
                        htmlFor="class-total-capacity"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        {t("classes.totalCapacity")}
                      </label>
                      <NumberStepper
                        id="class-total-capacity"
                        invalid={Boolean(formErrors.totalCapacity)}
                        describedBy={
                          formErrors.totalCapacity
                            ? `${formId}-totalCapacity`
                            : undefined
                        }
                        value={totalCapacity}
                        onChange={(value) => {
                          setTotalCapacity(value);
                          clearFormError("totalCapacity");
                          clearFormError("classistaCapacity");
                        }}
                        min={1}
                        label={t("classes.totalCapacity")}
                        className="w-fit"
                      />
                      {formErrors.totalCapacity ? (
                        <p
                          id={`${formId}-totalCapacity`}
                          className="text-sm font-medium text-destructive"
                        >
                          {formErrors.totalCapacity}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-col gap-4">
                      <label
                        htmlFor="class-classista-capacity"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        {t("classes.classistaCapacity")}
                      </label>
                      <NumberStepper
                        id="class-classista-capacity"
                        invalid={Boolean(formErrors.classistaCapacity)}
                        describedBy={
                          formErrors.classistaCapacity
                            ? `${formId}-classistaCapacity`
                            : undefined
                        }
                        value={classistaCapacity}
                        onChange={(value) => {
                          setClassistaCapacity(value);
                          clearFormError("classistaCapacity");
                        }}
                        min={1}
                        label={t("classes.classistaCapacity")}
                        className="w-fit"
                      />
                      {formErrors.classistaCapacity ? (
                        <p
                          id={`${formId}-classistaCapacity`}
                          className="text-sm font-medium text-destructive"
                        >
                          {formErrors.classistaCapacity}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* TODO: re-enable once the instructors API is connected, with its own
                  selected state and `instructorId` in the create request.
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
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                */}
                </div>
              </fieldset>

              {submitError ? (
                <p role="alert" className="mt-6 text-sm text-destructive">
                  {submitError}
                </p>
              ) : null}

              <div className="mt-8 flex justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="submit"
                  className="h-9"
                  disabled={isSaveDisabled || isSaving}
                >
                  {isSaving ? t("classes.saving") : t("common.save")}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
