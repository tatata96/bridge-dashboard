import { useQuery } from "@tanstack/react-query";

import type { VenueResponse } from "@/api/partners/partners.types";
import { apiFetch } from "@/lib/network/api-client";

// The backend lists only the partner's ACTIVE venues.
export function fetchVenues() {
  return;
}

export function useVenuesQuery() {
  return useQuery({
    queryKey: ["partner", "venues"],
    queryFn: () => apiFetch<VenueResponse[]>("/partner/venues"),
  });
}
