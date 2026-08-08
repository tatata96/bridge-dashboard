import { type ComponentProps } from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/classnames.utils";

function ToastProvider({
  ...props
}: ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />;
}

function ToastViewport({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 outline-none",
        className,
      )}
      {...props}
    />
  );
}

function Toast({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      duration={5000}
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl bg-popover px-4 py-3 text-sm text-popover-foreground shadow-2xl ring-1 ring-foreground/5 duration-100 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-2 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
}

function ToastAction({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "cursor-pointer font-medium text-primary underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "cursor-pointer text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      <XIcon className="size-4" />
    </ToastPrimitive.Close>
  );
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
