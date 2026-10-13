export type SubcategoryResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type CategoryResponse = SubcategoryResponse & {
  children: SubcategoryResponse[];
};
