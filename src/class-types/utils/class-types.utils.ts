import type {
  CategoryResponse,
  SubcategoryResponse,
} from "@/api/categories/categories.types";
import type { CreateClassTypeRequest } from "@/api/class-types/class-types.types";
import { normalizeOptionalText } from "@/lib/form.utils";

export type ClassTypeFormValues = {
  name: string;
  categoryId: string;
  description: string;
};

// Assumes the required fields are filled in (see getMissingFields).
export function buildCreateClassTypeRequest(
  values: ClassTypeFormValues,
): CreateClassTypeRequest {
  return {
    name: values.name.trim(),
    categoryId: values.categoryId,
    description: normalizeOptionalText(values.description),
  };
}

// A group of selectable categories. `label` is the parent's name, or null for
// a top-level category that is selectable on its own.
export type CategoryPickerGroup = {
  id: string;
  label: string | null;
  options: SubcategoryResponse[];
};

// Builds the picker's groups, filtered by a local search. Only categories
// with no children are selectable; a parent that has children is just the
// group heading. A query matching a parent's name keeps all its children.
export function getCategoryPickerGroups(
  categories: CategoryResponse[],
  search: string,
  locale: string,
): CategoryPickerGroup[] {
  const query = search.trim().toLocaleLowerCase(locale);
  const matches = (name: string) =>
    name.toLocaleLowerCase(locale).includes(query);

  return categories.flatMap<CategoryPickerGroup>((category) => {
    if (category.children.length === 0) {
      return matches(category.name)
        ? [{ id: category.id, label: null, options: [category] }]
        : [];
    }

    const options = matches(category.name)
      ? category.children
      : category.children.filter((child) => matches(child.name));

    return options.length > 0
      ? [{ id: category.id, label: category.name, options }]
      : [];
  });
}

// The selected category's own name plus its parent's, for the picker trigger.
export function findSelectedCategory(
  categories: CategoryResponse[],
  categoryId: string,
) {
  for (const category of categories) {
    if (category.id === categoryId && category.children.length === 0) {
      return { name: category.name, parentName: null };
    }

    const child = category.children.find((item) => item.id === categoryId);
    if (child) {
      return { name: child.name, parentName: category.name };
    }
  }

  return null;
}
