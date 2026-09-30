import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { VenueResponse } from "@/api/partners/partners.types";
import { apiFetch } from "@/lib/network/api-client";

export const venuesQueryKey = ["partner", "venues"] as const;

// The backend lists only the partner's ACTIVE venues.
export function fetchVenues() {
  return;
}

export function useVenuesQuery() {
  return useQuery({
    queryKey: venuesQueryKey,
    queryFn: () => apiFetch<VenueResponse[]>("/partner/venues"),
  });
}

export function archiveVenue(venueId: string) {
  return apiFetch<VenueResponse>(`/partner/venues/${venueId}/archive`, {
    method: "POST",
  });
}

export function useArchiveVenueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveVenue,
    // The list holds only ACTIVE venues, so an archived one leaves it.
    onSuccess: (venue) => {
      queryClient.setQueryData<VenueResponse[]>(venuesQueryKey, (venues) =>
        venues?.filter((current) => current.id !== venue.id),
      );
    },
  });
}
