import { createContext, useContext } from "react";

export type ToastActionConfig = {
  label: string;
  onClick: () => void;
};

export type ToastItem = {
  id: string;
  title: string;
  action?: ToastActionConfig;
};

export const ToastContext = createContext<{
  toast: (input: { title: string; action?: ToastActionConfig }) => void;
} | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a Toaster");
  }
  return context;
}
