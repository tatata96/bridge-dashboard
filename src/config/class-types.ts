import type { TranslationKey } from "@/i18n/i18n";

export const categories = [
  { id: "crossfit", labelKey: "classTypes.crossfit" },
  { id: "yoga", labelKey: "classTypes.yoga" },
  { id: "pilates", labelKey: "classTypes.pilates" },
  { id: "dance", labelKey: "classTypes.dance" },
  { id: "boxing", labelKey: "classTypes.boxing" },
  { id: "workshop", labelKey: "classTypes.workshop" },
] as const satisfies readonly {
  id: string;
  labelKey: TranslationKey;
}[];

export type CategoryId = (typeof categories)[number]["id"];
