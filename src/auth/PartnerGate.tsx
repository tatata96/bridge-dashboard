import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { defaultPageId, getPagePath } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";

type PartnerGateProps = {
  isOnboardingCompleted: boolean;
  children: ReactNode;
};

// Routes on the /auth/me result. Each route declares whether it needs
// onboarding to be completed (a partner exists) or not yet completed.
// Must sit inside ProtectedRoute, which guarantees a session. Children mount
// only once /auth/me has resolved.
export function PartnerGate({
  isOnboardingCompleted,
  children,
}: PartnerGateProps) {
  const { classistaUser, classistaUserError, refetchClassistaUser } = useAuth();
  const { t } = useI18n();

  // An error must never be read as "no partner", so it never redirects.
  // It blocks the page only when there is no loaded user to fall back on; a
  // failed refetch keeps rendering from the cached user.
  if (classistaUserError && !classistaUser) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p role="alert" className="text-sm text-muted-foreground">
          {t("auth.accountError")}
        </p>
        <Button variant="outline" onClick={() => refetchClassistaUser()}>
          {t("auth.retry")}
        </Button>
      </div>
    );
  }

  if (!classistaUser) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <span className="text-sm text-muted-foreground">
          {t("auth.accountLoading")}
        </span>
      </div>
    );
  }

  const onboardingCompleted = classistaUser.partner !== null;

  if (isOnboardingCompleted && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!isOnboardingCompleted && onboardingCompleted) {
    return <Navigate to={getPagePath(defaultPageId)} replace />;
  }

  return children;
}
