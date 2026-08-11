import type { Class } from "@/types/classes";

export function getUniqueClassesByName(classes: Class[]) {
  const classesByName = new Map<string, Class>();

  for (const classItem of classes) {
    if (!classesByName.has(classItem.name)) {
      classesByName.set(classItem.name, classItem);
    }
  }

  return Array.from(classesByName.values());
}
