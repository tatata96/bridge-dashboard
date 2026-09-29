import { useState, type ReactNode, type SubmitEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/i18n";

// Raw field values. Trimming and mapping to the API request happens where
// the form is connected to the mutation.
export type OnboardingFormValues = {
  partnerName: string;
  partnerDescription: string;
  venueName: string;
  addressLine: string;
  district: string;
  city: string;
  postalCode: string;
  phone: string;
};

type OnboardingFormProps = {
  onSubmit: (values: OnboardingFormValues) => void;
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
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
      {label}
      {children}
      {hint && <span className="text-xs font-normal">{hint}</span>}
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

  function setValue(field: keyof OnboardingFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-8">
      <section className="flex min-w-0 flex-col gap-4">
        <h2 className="text-base font-semibold tracking-normal">
          {t("onboarding.business.title")}
        </h2>

        <Field label={t("onboarding.business.name")}>
          <Input
            required
            maxLength={150}
            autoComplete="organization"
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

        <Field label={t("onboarding.location.address")}>
          <Input
            required
            maxLength={255}
            autoComplete="street-address"
            value={values.addressLine}
            onChange={(event) => setValue("addressLine", event.target.value)}
          />
        </Field>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Field label={t("onboarding.location.district")}>
            <Input
              required
              maxLength={100}
              value={values.district}
              onChange={(event) => setValue("district", event.target.value)}
            />
          </Field>

          <Field label={t("onboarding.location.city")}>
            <Input
              required
              maxLength={100}
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
