import type { Venue } from "@/types/venues";

export const mockPartnerId = "partner-core-studio";

export const mockVenues: Venue[] = [
  {
    id: "venue-kadikoy",
    partnerId: mockPartnerId,
    name: "Core Studio Kadikoy",
    addressLine: "Caferaga Mah. Moda Cad. No: 42",
    district: "Kadikoy",
    city: "Istanbul",
    postalCode: "34710",
    latitude: null,
    longitude: null,
    phone: "+90 216 555 01 01",
    timezone: "Europe/Istanbul",
    amenityIds: ["lockers", "showers", "changing-rooms", "wifi"],
    status: "active",
  },
  {
    id: "venue-besiktas",
    partnerId: mockPartnerId,
    name: "Core Studio Besiktas",
    addressLine: "Sinanpasa Mah. Barbaros Bulvari No: 18",
    district: "Besiktas",
    city: "Istanbul",
    postalCode: "34353",
    latitude: null,
    longitude: null,
    phone: "+90 212 555 02 02",
    timezone: "Europe/Istanbul",
    amenityIds: ["car-parking", "lockers", "ac", "wifi"],
    status: "active",
  },
  {
    id: "venue-nisantasi",
    partnerId: mockPartnerId,
    name: "Core Studio Nisantasi",
    addressLine: "Tesvikiye Mah. Akkavak Sok. No: 7",
    district: "Sisli",
    city: "Istanbul",
    postalCode: null,
    latitude: null,
    longitude: null,
    phone: null,
    timezone: "Europe/Istanbul",
    amenityIds: ["toilets", "changing-rooms", "wifi"],
    status: "archived",
  },
];

export const mockVenuesById = new Map(
  mockVenues.map((venue) => [venue.id, venue]),
);
