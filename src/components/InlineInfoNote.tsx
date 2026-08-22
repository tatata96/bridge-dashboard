import { type ComponentProps } from "react";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/classnames.utils";

export function InlineInfoNote({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      <InfoIcon className="size-3.5 shrink-0 mt-2" aria-hidden="true" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}
