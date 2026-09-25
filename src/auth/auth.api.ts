import type { ClassistaUser } from "@/auth/auth.types";
import { apiFetch } from "@/lib/network/api-client";

// The backend guard creates the Classista user row on first call.
export function fetchMe() {
  return apiFetch<ClassistaUser>("/auth/me");
}
