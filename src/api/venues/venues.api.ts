import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  UpdateVenueRequest,
  VenueResponse,
} from "@/api/partners/partners.types";
import { apiFetch } from "@/lib/network/api-client";

export const venuesQueryKey = ["partner", "venues"] as const;

// The backend lists only the partner's ACTIVE venues.
export function fetchVenues() {
  return apiFetch<VenueResponse[]>("/partner/venues");
}

export function useVenuesQuery() {
  return useQuery({
    queryKey: venuesQueryKey,
    queryFn: fetchVenues,
  });
}

export function updateVenue(venueId: string, request: UpdateVenueRequest) {
  return apiFetch<VenueResponse>(`/partner/venues/${venueId}`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function useUpdateVenueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      venueId,
      request,
    }: {
      venueId: string;
      request: UpdateVenueRequest;
    }) => updateVenue(venueId, request),
    // Swap the updated venue into the cached list and leave the others (and
    // their order) as they are.
    onSuccess: (venue) => {
      queryClient.setQueryData<VenueResponse[]>(venuesQueryKey, (venues) =>
        venues?.map((current) => (current.id === venue.id ? venue : current)),
      );
    },
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
