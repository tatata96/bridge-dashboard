import { type ComponentProps, type ReactNode, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ConfirmDialogTone = "neutral" | "destructive";

export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  body,
  confirmLabel,
  cancelLabel,
  tone = "neutral",
  onConfirm,
  confirmDisabled,
  children,
  contentProps,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode | null;
  title: ReactNode;
  body?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  tone?: ConfirmDialogTone;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  children?: ReactNode;
  contentProps?: ComponentProps<typeof DialogContent>;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const internalCancelButtonRef = useRef<HTMLButtonElement>(null);
  const isControlled = open !== undefined;
  const dialogOpen = open ?? uncontrolledOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger !== null && trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : null}
      <DialogContent
        {...contentProps}
        onOpenAutoFocus={(event) => {
          contentProps?.onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          internalCancelButtonRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {body ? (
            typeof body === "string" ? (
              <DialogDescription className="whitespace-pre-line">
                {body}
              </DialogDescription>
            ) : (
              <DialogDescription asChild>
                <div className="text-sm text-muted-foreground">{body}</div>
              </DialogDescription>
            )
          ) : null}
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button
            ref={internalCancelButtonRef}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={tone === "destructive" ? "destructive" : "default"}
            size="sm"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
