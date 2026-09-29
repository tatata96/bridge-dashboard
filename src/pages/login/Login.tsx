import { useNavigate } from "react-router-dom";

import { APP_NAME } from "@/config/constants";
import { defaultPageId, getPagePath } from "@/config/navigation";
import { LoginForm } from "@/pages/login/LoginForm";

export function LoginPage() {
  const navigate = useNavigate();

  function handleSuccess() {
    // Always enter through the default route; PartnerGate then decides
    // between the dashboard and onboarding.
    navigate(getPagePath(defaultPageId), { replace: true });
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-sm ring-1 ring-foreground/5">
        <h1 className="text-xl font-semibold tracking-normal mb-2">
          {APP_NAME}
        </h1>
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}
