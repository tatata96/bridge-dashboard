import { useState } from "react";

import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
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
  const { signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError(null);

    const { error } = await signOut();

    if (error) {
      setLogoutError(t("auth.logoutError"));
      setLoggingOut(false);
    }
  }

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

      <section className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-normal">
          {t("auth.session")}
        </h2>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-fit"
        >
          {t("auth.logout")}
        </Button>
        {logoutError && (
          <p role="alert" className="text-sm text-destructive">
            {logoutError}
          </p>
        )}
      </section>
    </main>
  );
}
