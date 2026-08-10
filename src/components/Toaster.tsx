import { useCallback, useState, type ReactNode } from "react";
import { Undo2Icon } from "lucide-react";

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastProvider as ToastPrimitiveProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import {
  ToastContext,
  type ToastActionConfig,
  type ToastItem,
} from "@/hooks/use-toast";
import { useI18n } from "@/i18n/i18n";

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { t } = useI18n();

  const toast = useCallback(
    (input: { title: string; action?: ToastActionConfig }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, ...input }]);
    },
    [],
  );

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitiveProvider>
        {children}
        {toasts.map((item) => (
          <Toast
            key={item.id}
            onOpenChange={(open) => {
              if (!open) dismiss(item.id);
            }}
          >
            <div className="flex items-center gap-1.5">
              <ToastTitle>{item.title}</ToastTitle>
              {item.action ? (
                <>
                  <span className="text-white/50" aria-hidden="true">
                    ·
                  </span>
                  <ToastAction
                    altText={item.action.label}
                    onClick={() => {
                      item.action?.onClick();
                      dismiss(item.id);
                    }}
                    className="inline-flex items-center gap-1"
                  >
                    <Undo2Icon className="size-3.5" aria-hidden="true" />
                    {item.action.label}
                  </ToastAction>
                </>
              ) : null}
            </div>
            <ToastClose aria-label={t("common.dismiss")} />
          </Toast>
        ))}
        <ToastViewport />
      </ToastPrimitiveProvider>
    </ToastContext.Provider>
  );
}
