import type { ClassStatus } from "@/types/classes";

export async function saveClassStatus(entryId: string, status: ClassStatus) {
  void entryId;
  void status;
  await new Promise((resolve) => window.setTimeout(resolve, 300));
}
