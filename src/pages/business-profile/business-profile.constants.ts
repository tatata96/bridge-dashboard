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
] satisfies {
  id: string;
  labelKey: TranslationKey;
}[];

export type BusinessAmenityId = (typeof BUSINESS_AMENITIES)[number]["id"];
