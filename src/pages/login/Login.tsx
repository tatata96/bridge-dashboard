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
        <div className="mb-6 flex flex-col items-center gap-4">
          <img
            src="/logo.svg"
            alt={`${APP_NAME} logo`}
            width={96}
            height={96}
            className="size-24 shrink-0 rounded-[22%]"
          />
          <h1 className="text-xl font-semibold tracking-normal">{APP_NAME}</h1>
        </div>
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}
