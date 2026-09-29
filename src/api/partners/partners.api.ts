import { useMutation, useQueryClient } from "@tanstack/react-query";

import { meQueryKey } from "@/api/auth/auth.api";
import type {
  PartnerOnboardingRequest,
  PartnerOnboardingResponse,
} from "@/api/partners/partners.types";
import { useAuth } from "@/auth/AuthContext";
import { apiFetch } from "@/lib/network/api-client";

export function submitPartnerOnboarding(request: PartnerOnboardingRequest) {
  return apiFetch<PartnerOnboardingResponse>("/partners/onboarding", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function usePartnerOnboardingMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: submitPartnerOnboarding,
    //Onboarding changed the user's partner, so refetch /auth/me.
    onSuccess: () => {
      if (!user) return;

      return queryClient.invalidateQueries({
        queryKey: meQueryKey(user.id),
      });
    },
  });
}
