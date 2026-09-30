import type { VenueAmenity } from "@/api/partners/partners.types";
import type { TranslationKey } from "@/i18n/i18n";

// Ids are the backend VenueAmenity values, so they are sent as they are.
export const VENUE_AMENITIES = [
  { id: "SHOWER", labelKey: "businessProfile.amenity.SHOWER" },
  { id: "CHANGING_ROOM", labelKey: "businessProfile.amenity.CHANGING_ROOM" },
  { id: "LOCKERS", labelKey: "businessProfile.amenity.LOCKERS" },
  { id: "PARKING", labelKey: "businessProfile.amenity.PARKING" },
  { id: "TOWELS", labelKey: "businessProfile.amenity.TOWELS" },
  { id: "EQUIPMENT", labelKey: "businessProfile.amenity.EQUIPMENT" },
  { id: "WIFI", labelKey: "businessProfile.amenity.WIFI" },
  { id: "ACCESSIBLE", labelKey: "businessProfile.amenity.ACCESSIBLE" },
  { id: "WATER", labelKey: "businessProfile.amenity.WATER" },
  { id: "MAT_PROVIDED", labelKey: "businessProfile.amenity.MAT_PROVIDED" },
] as const satisfies {
  id: VenueAmenity;
  labelKey: TranslationKey;
}[];

export const PARTNER_CONTACT_FIELDS = [
  {
    id: "phone",
    labelKey: "businessProfile.contact.phone",
    placeholderKey: "businessProfile.contact.phonePlaceholder",
    icon: "phone",
  },
  {
    id: "website",
    labelKey: "businessProfile.contact.website",
    placeholderKey: "businessProfile.contact.websitePlaceholder",
    icon: "website",
  },
  {
    id: "facebook",
    labelKey: "businessProfile.contact.facebook",
    placeholderKey: "businessProfile.contact.facebookPlaceholder",
    icon: "facebook",
  },
  {
    id: "instagram",
    labelKey: "businessProfile.contact.instagram",
    placeholderKey: "businessProfile.contact.instagramPlaceholder",
    icon: "instagram",
  },
  {
    id: "x",
    labelKey: "businessProfile.contact.x",
    placeholderKey: "businessProfile.contact.xPlaceholder",
    icon: "x",
  },
  {
    id: "tiktok",
    labelKey: "businessProfile.contact.tiktok",
    placeholderKey: "businessProfile.contact.tiktokPlaceholder",
    icon: "tiktok",
  },
] as const satisfies {
  id: string;
  labelKey: TranslationKey;
  placeholderKey: TranslationKey;
  icon: "phone" | "website" | "facebook" | "instagram" | "x" | "tiktok";
}[];

export type PartnerContactFieldId =
  (typeof PARTNER_CONTACT_FIELDS)[number]["id"];

// Values are minutes before class start, as stored in bookingCutoffMinutes.
export const RESERVATION_DEADLINE_OPTIONS = [
  { value: 15, labelKey: "businessProfile.reservationDeadline.15Min" },
  { value: 60, labelKey: "businessProfile.reservationDeadline.1Hour" },
  { value: 120, labelKey: "businessProfile.reservationDeadline.2Hours" },
  { value: 360, labelKey: "businessProfile.reservationDeadline.6Hours" },
  { value: 720, labelKey: "businessProfile.reservationDeadline.12Hours" },
] as const satisfies {
  value: number;
  labelKey: TranslationKey;
}[];
