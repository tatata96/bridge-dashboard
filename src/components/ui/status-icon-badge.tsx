import { CheckIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/classnames.utils";

export function StatusIconBadge({
  variant,
  label,
}: {
  variant: "check" | "cross";
  label: string;
}) {
  const Icon = variant === "check" ? CheckIcon : XIcon;

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "flex size-6 items-center justify-center rounded-full border",
        variant === "check"
          ? "border-green-600 bg-green-600 text-white"
          : "border-red-600 bg-red-600 text-white",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
    </span>
  );
}
