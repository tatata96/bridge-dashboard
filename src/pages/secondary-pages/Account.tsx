import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import { useI18n, type Language } from "@/i18n/i18n";

const languageOptions: {
  value: Language;
  labelKey: "common.english" | "common.turkish";
  shortLabel: string;
}[] = [
  { value: "en", labelKey: "common.english", shortLabel: "EN" },
  { value: "tr", labelKey: "common.turkish", shortLabel: "TR" },
];

export function AccountPage() {
  const { language, setLanguage, t } = useI18n();

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <section className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-normal">
          {t("common.language")}
        </h2>
        <SegmentedToggle
          value={language}
          options={languageOptions.map((option) => ({
            value: option.value,
            label: option.shortLabel,
            ariaLabel: t(option.labelKey),
          }))}
          onValueChange={setLanguage}
          aria-label={t("common.language")}
        />
      </section>
    </main>
  );
}
