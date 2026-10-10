// Mirrors the backend VenueAmenity enum (src/venues/venue-amenity.ts).
export type VenueAmenity =
  | "SHOWER"
  | "CHANGING_ROOM"
  | "LOCKERS"
  | "PARKING"
  | "TOWELS"
  | "EQUIPMENT"
  | "WIFI"
  | "ACCESSIBLE"
  | "WATER"
  | "MAT_PROVIDED";

export type PartnerOnboardingRequest = {
  partner: {
    name: string;
    description?: string;
  };
  venue: {
    name?: string;
    addressLine: string;
    district: string;
    city: string;
    postalCode?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    amenityIds?: VenueAmenity[];
  };
};

export type PartnerBusinessProfileResponse = {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramHandle: string | null;
  xHandle: string | null;
  tiktokHandle: string | null;
  // Minutes before a class starts that bookings close.
  bookingCutoffMinutes: number;
};

// VenueResponseDto. Not the same shape as the mock-data `Venue` in
// src/types/venues.ts (see that file), so it is kept separate.
export type VenueResponse = {
  id: string;
  name: string;
  status: "ACTIVE" | "ARCHIVED";
  addressLine: string;
  district: string;
  city: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  timezone: string;
  amenityIds: VenueAmenity[];
  // ISO 8601 strings (Date serialized as JSON).
  createdAt: string;
  updatedAt: string;
};

export type PartnerOnboardingResponse = {
  partner: PartnerBusinessProfileResponse;
  venue: VenueResponse;
};

export type UpdatePartnerBusinessProfileRequest = {
  name?: string;
  description?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramHandle?: string | null;
  xHandle?: string | null;
  tiktokHandle?: string | null;
  bookingCutoffMinutes?: number;
};

export type UpdateVenueRequest = {
  name?: string;
  addressLine?: string;
  district?: string;
  city?: string;
  timezone?: string;
  postalCode?: string | null;
  phone?: string | null;
  amenityIds?: VenueAmenity[];
};
