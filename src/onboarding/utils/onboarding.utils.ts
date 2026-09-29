import type { PartnerOnboardingRequest } from "@/api/partners/partners.types";
import type {
  OnboardingFormValues,
  RequiredOnboardingField,
} from "@/onboarding/types/onboarding-form.types";

const requiredFields: RequiredOnboardingField[] = [
  "partnerName",
  "addressLine",
  "district",
  "city",
];

// HTML `required` accepts whitespace-only values, so check the trimmed text.
export function getMissingRequiredFields(
  values: OnboardingFormValues,
): RequiredOnboardingField[] {
  return requiredFields.filter((field) => values[field].trim() === "");
}

// Optional fields that are empty after trimming are omitted: the backend
// rejects empty strings on them.
function optional(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function toPartnerOnboardingRequest(
  values: OnboardingFormValues,
): PartnerOnboardingRequest {
  return {
    partner: {
      name: values.partnerName.trim(),
      description: optional(values.partnerDescription),
    },
    venue: {
      name: optional(values.venueName),
      addressLine: values.addressLine.trim(),
      district: values.district.trim(),
      city: values.city.trim(),
      postalCode: optional(values.postalCode),
      phone: optional(values.phone),
    },
  };
}
