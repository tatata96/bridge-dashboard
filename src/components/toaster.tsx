import { useCallback, useState, type ReactNode } from "react";

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

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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
                  <span className="text-muted-foreground" aria-hidden="true">
                    ·
                  </span>
                  <ToastAction
                    altText={item.action.label}
                    onClick={() => {
                      item.action?.onClick();
                      dismiss(item.id);
                    }}
                  >
                    {item.action.label}
                  </ToastAction>
                </>
              ) : null}
            </div>
            <ToastClose aria-label="Dismiss" />
          </Toast>
        ))}
        <ToastViewport />
      </ToastPrimitiveProvider>
    </ToastContext.Provider>
  );
}
