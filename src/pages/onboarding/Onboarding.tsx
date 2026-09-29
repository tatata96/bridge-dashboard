import { useState } from "react";

import { ApiError } from "@/lib/network/api-client";
import { usePartnerOnboardingMutation } from "@/api/partners/partners.api";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { useI18n, type TranslationKey } from "@/i18n/i18n";
import { OnboardingForm } from "@/onboarding/components/OnboardingForm";

// Backend details are never shown; each case maps to a translated message.
function getOnboardingErrorKey(error: Error): TranslationKey {
  if (error instanceof ApiError) {
    if (error.status === 400) return "onboarding.error.invalid";
    if (error.status === 409) return "onboarding.error.conflict";
  }
  return "onboarding.error.generic";
}

export function OnboardingPage() {
  const { t } = useI18n();
  const onboarding = usePartnerOnboardingMutation();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError(null);

    const { error } = await signOut();

    if (error) {
      setSignOutError(t("auth.logoutError"));
      setSigningOut(false);
    }
  }

  return (
    <main className="flex min-h-svh justify-center bg-muted/30 p-6">
      <div className="flex w-full max-w-xl flex-col gap-4 self-start">
        <div className="rounded-2xl bg-background p-6 shadow-sm ring-1 ring-foreground/5">
          <h1 className="text-xl font-semibold tracking-normal">
            {t("onboarding.title")}
          </h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            {t("onboarding.subtitle")}
          </p>
          <OnboardingForm
            onSubmit={(request) => onboarding.mutate(request)}
            submitting={onboarding.isPending}
            errorMessage={
              onboarding.error
                ? t(getOnboardingErrorKey(onboarding.error))
                : null
            }
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          {signOutError && (
            <p role="alert" className="text-sm text-destructive">
              {signOutError}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {t("auth.logout")}
          </Button>
        </div>
      </div>
    </main>
  );
}
