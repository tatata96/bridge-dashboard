import type { PartnerBusinessProfileResponse } from "@/api/partners/partners.types";
import {
  PARTNER_CONTACT_FIELDS,
  type PartnerContactFieldId,
} from "@/business-profile/constants/business-profile.constants";

// The API's null (no value) becomes "" for the inputs.
export function toContactValues(profile: PartnerBusinessProfileResponse) {
  return PARTNER_CONTACT_FIELDS.reduce(
    (values, field) => ({ ...values, [field.id]: profile[field.id] ?? "" }),
    {} as Record<PartnerContactFieldId, string>,
  );
}

export function stripHandlePrefix(value: string) {
  return value.replace(/^@+/, "");
}
