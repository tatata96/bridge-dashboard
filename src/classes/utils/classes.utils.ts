import type { ClassPlan } from "@/types/classes";

export function getUniqueClassesByName(classes: ClassPlan[]) {
  const classesByName = new Map<string, ClassPlan>();

  for (const classItem of classes) {
    if (!classesByName.has(classItem.name)) {
      classesByName.set(classItem.name, classItem);
    }
  }

  return Array.from(classesByName.values());
}
