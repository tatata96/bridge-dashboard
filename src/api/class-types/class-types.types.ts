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

// Edit body: only the fields that changed. `name` and `categoryId` are never
// null; `description: null` clears the description.
export type UpdateClassTypeRequest = {
  name?: string;
  categoryId?: string;
  description?: string | null;
};
