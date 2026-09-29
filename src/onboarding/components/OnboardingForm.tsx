import { useState, type ReactNode, type SubmitEvent } from "react";

import type { PartnerOnboardingRequest } from "@/api/partners/partners.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/i18n";
import type {
  OnboardingFormValues,
  RequiredOnboardingField,
} from "@/onboarding/types/onboarding-form.types";
import {
  getMissingRequiredFields,
  toPartnerOnboardingRequest,
} from "@/onboarding/utils/onboarding.utils";

type OnboardingFormProps = {
  onSubmit: (request: PartnerOnboardingRequest) => void;
  submitting?: boolean;
  errorMessage?: string | null;
};

const initialValues: OnboardingFormValues = {
  partnerName: "",
  partnerDescription: "",
  venueName: "",
  addressLine: "",
  district: "",
  city: "",
  postalCode: "",
  phone: "",
};

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
      {label}
      {children}
      {hint && <span className="text-xs font-normal">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs font-normal text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}

export function OnboardingForm({
  onSubmit,
  submitting = false,
  errorMessage = null,
}: OnboardingFormProps) {
  const { t } = useI18n();
  const [values, setValues] = useState(initialValues);
  const [missingFields, setMissingFields] = useState<RequiredOnboardingField[]>(
    [],
  );

  function setValue(field: keyof OnboardingFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setMissingFields((current) => current.filter((f) => f !== field));
  }

  function fieldError(field: RequiredOnboardingField) {
    return missingFields.includes(field)
      ? t("onboarding.error.required")
      : undefined;
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const missing = getMissingRequiredFields(values);
    setMissingFields(missing);
    if (missing.length > 0) return;

    onSubmit(toPartnerOnboardingRequest(values));
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-8">
      <section className="flex min-w-0 flex-col gap-4">
        <h2 className="text-base font-semibold tracking-normal">
          {t("onboarding.business.title")}
        </h2>

        <Field
          label={t("onboarding.business.name")}
          error={fieldError("partnerName")}
        >
          <Input
            required
            maxLength={150}
            autoComplete="organization"
            aria-invalid={missingFields.includes("partnerName")}
            value={values.partnerName}
            onChange={(event) => setValue("partnerName", event.target.value)}
          />
        </Field>

        <Field
          label={`${t("onboarding.business.description")} (${t("onboarding.optional")})`}
        >
          <Textarea
            maxLength={2000}
            value={values.partnerDescription}
            onChange={(event) =>
              setValue("partnerDescription", event.target.value)
            }
          />
        </Field>
      </section>

      <section className="flex min-w-0 flex-col gap-4">
        <h2 className="text-base font-semibold tracking-normal">
          {t("onboarding.location.title")}
        </h2>

        <Field
          label={`${t("onboarding.location.name")} (${t("onboarding.optional")})`}
          hint={t("onboarding.location.nameHint")}
        >
          <Input
            maxLength={150}
            value={values.venueName}
            onChange={(event) => setValue("venueName", event.target.value)}
          />
        </Field>

        <Field
          label={t("onboarding.location.address")}
          error={fieldError("addressLine")}
        >
          <Input
            required
            maxLength={255}
            autoComplete="street-address"
            aria-invalid={missingFields.includes("addressLine")}
            value={values.addressLine}
            onChange={(event) => setValue("addressLine", event.target.value)}
          />
        </Field>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Field
            label={t("onboarding.location.district")}
            error={fieldError("district")}
          >
            <Input
              required
              maxLength={100}
              aria-invalid={missingFields.includes("district")}
              value={values.district}
              onChange={(event) => setValue("district", event.target.value)}
            />
          </Field>

          <Field
            label={t("onboarding.location.city")}
            error={fieldError("city")}
          >
            <Input
              required
              maxLength={100}
              aria-invalid={missingFields.includes("city")}
              value={values.city}
              onChange={(event) => setValue("city", event.target.value)}
            />
          </Field>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Field
            label={`${t("onboarding.location.postalCode")} (${t("onboarding.optional")})`}
          >
            <Input
              maxLength={20}
              autoComplete="postal-code"
              value={values.postalCode}
              onChange={(event) => setValue("postalCode", event.target.value)}
            />
          </Field>

          <Field
            label={`${t("onboarding.location.phone")} (${t("onboarding.optional")})`}
          >
            <Input
              type="tel"
              maxLength={30}
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => setValue("phone", event.target.value)}
            />
          </Field>
        </div>
      </section>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? t("onboarding.submitting") : t("onboarding.submit")}
      </Button>
    </form>
  );
}
