import { useI18n } from "@/i18n/i18n";

// Placeholder: the onboarding form is added in a later step.
export function OnboardingPage() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <h1 className="text-xl font-semibold tracking-normal">
        {t("onboarding.title")}
      </h1>
    </main>
  );
}
