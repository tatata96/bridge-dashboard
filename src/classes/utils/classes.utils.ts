import { categories } from "@/config/class-types";
import type { CategoryId } from "@/config/class-types";
import type { ClassPlan, ClassType } from "@/types/classes";

export const categoriesById = new Map(
  categories.map((category) => [category.id, category]),
);

export function getClassType(
  classTypeId: ClassType["id"],
  classTypesById: Map<ClassType["id"], ClassType>,
) {
  return classTypesById.get(classTypeId) ?? null;
}

export function getClassPlanClassType(
  classPlan: ClassPlan,
  classTypesById: Map<ClassType["id"], ClassType>,
) {
  return getClassType(classPlan.classTypeId, classTypesById);
}

export function getClassPlanCategoryId(
  classPlan: ClassPlan,
  classTypesById: Map<ClassType["id"], ClassType>,
): CategoryId | null {
  return getClassPlanClassType(classPlan, classTypesById)?.categoryId ?? null;
}

export function getCategoryIdsForClassPlans(
  classPlans: ClassPlan[],
  classTypesById: Map<ClassType["id"], ClassType>,
) {
  return new Set(
    classPlans
      .map((classPlan) => getClassPlanCategoryId(classPlan, classTypesById))
      .filter((categoryId): categoryId is CategoryId => Boolean(categoryId)),
  );
}
