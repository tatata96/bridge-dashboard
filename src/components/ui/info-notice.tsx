import { type ComponentProps } from "react";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/classnames.utils";

function InfoNotice({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-md border border-border p-2 text-sm text-[#3F3F46]",
        className,
      )}
      {...props}
    >
      <InfoIcon
        className="mt-0.75 size-4 shrink-0 text-foreground"
        aria-hidden="true"
      />
      <div className="min-w-0 whitespace-normal wrap-break-word">
        {children}
      </div>
    </div>
  );
}

export { InfoNotice };
