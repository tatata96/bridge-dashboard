import type { PartnerContactFieldId } from "@/business-profile/constants/business-profile.constants";

// The partner half of the form, as the inputs hold it: "" means no value.
export type PartnerFormValues = {
  name: string;
  description: string;
  contacts: Record<PartnerContactFieldId, string>;
  bookingCutoffMinutes: number;
};
