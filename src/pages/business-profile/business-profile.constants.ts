import type { TranslationKey } from "@/i18n/i18n";

export const BUSINESS_AMENITIES = [
  { id: "car-parking", labelKey: "businessProfile.amenity.carParking" },
  { id: "prayer-area", labelKey: "businessProfile.amenity.prayerArea" },
  { id: "toilets", labelKey: "businessProfile.amenity.toilets" },
  { id: "lockers", labelKey: "businessProfile.amenity.lockers" },
  { id: "ac", labelKey: "businessProfile.amenity.ac" },
  {
    id: "wheelchair-access",
    labelKey: "businessProfile.amenity.wheelchairAccess",
  },
  {
    id: "child-friendly-area",
    labelKey: "businessProfile.amenity.childFriendlyArea",
  },
  { id: "wifi", labelKey: "businessProfile.amenity.wifi" },
  { id: "showers", labelKey: "businessProfile.amenity.showers" },
  { id: "changing-rooms", labelKey: "businessProfile.amenity.changingRooms" },
] as const satisfies {
  id: string;
  labelKey: TranslationKey;
}[];

export type BusinessAmenityId = (typeof BUSINESS_AMENITIES)[number]["id"];

export const BUSINESS_CONTACT_FIELDS = [
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

export type BusinessContactFieldId =
  (typeof BUSINESS_CONTACT_FIELDS)[number]["id"];
