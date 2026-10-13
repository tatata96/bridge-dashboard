export type ClassTypeResponse = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  // Leaf category label. Parent labels come from GET /categories.
  category: { id: string; name: string };
  isActive: boolean;
  // ISO 8601 strings (Date serialized as JSON).
  createdAt: string;
  updatedAt: string;
};

// "active" is the backend default; "archived" is `?isActive=false`.
export type ClassTypeStatus = "active" | "archived";

export type CreateClassTypeRequest = {
  name: string;
  categoryId: string;
  description?: string;
};
