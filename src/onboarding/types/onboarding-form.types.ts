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

export type RequiredOnboardingField =
  "partnerName" | "addressLine" | "district" | "city";
