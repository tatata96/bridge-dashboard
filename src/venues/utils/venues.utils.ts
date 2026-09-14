import { mockVenuesById } from "@/venues/data/venues.mock-data";

export const venuesById = mockVenuesById;

export function getVenueName(
  venueId: string | null | undefined,
  fallbackName: string,
) {
  if (!venueId) return fallbackName;
  return venuesById.get(venueId)?.name ?? fallbackName;
}
