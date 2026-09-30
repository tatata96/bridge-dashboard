import type { PartnerOnboardingRequest } from "@/api/partners/partners.types";
import type {
  OnboardingFormValues,
  RequiredOnboardingField,
} from "@/onboarding/types/onboarding-form.types";
import { getMissingFields, normalizeOptionalText } from "@/lib/form.utils";

const requiredFields: RequiredOnboardingField[] = [
  "partnerName",
  "addressLine",
  "district",
  "city",
];

export function getMissingRequiredFields(
  values: OnboardingFormValues,
): RequiredOnboardingField[] {
  return getMissingFields(values, requiredFields);
}

export function toPartnerOnboardingRequest(
  values: OnboardingFormValues,
): PartnerOnboardingRequest {
  return {
    partner: {
      name: values.partnerName.trim(),
      description: normalizeOptionalText(values.partnerDescription),
    },
    venue: {
      name: normalizeOptionalText(values.venueName),
      addressLine: values.addressLine.trim(),
      district: values.district.trim(),
      city: values.city.trim(),
      postalCode: normalizeOptionalText(values.postalCode),
      phone: normalizeOptionalText(values.phone),
    },
  };
}
