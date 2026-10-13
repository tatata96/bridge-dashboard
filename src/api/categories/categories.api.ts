import { useQuery } from "@tanstack/react-query";

import type { CategoryResponse } from "@/api/categories/categories.types";
import { apiFetch } from "@/lib/network/api-client";

// Public reference data shared by every partner, so the key is not under "partner".
export const categoriesQueryKey = ["categories"] as const;

export function fetchCategories() {
  return apiFetch<CategoryResponse[]>("/categories");
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
    // Categories rarely change, so don't refetch on every dialog open.
    staleTime: 10 * 60 * 1000,
  });
}
