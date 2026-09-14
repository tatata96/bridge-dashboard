export type VenueStatus = "active" | "archived";

export type Venue = {
  id: string;
  partnerId: string;
  name: string;
  addressLine: string;
  district: string;
  city: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  timezone: string;
  amenityIds: string[];
  status: VenueStatus;
};
