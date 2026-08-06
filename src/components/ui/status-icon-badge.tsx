import { CheckIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/classnames.utils";

export function StatusIconBadge({ variant }: { variant: "check" | "cross" }) {
  const Icon = variant === "check" ? CheckIcon : XIcon;

  return (
    <span
      className={cn(
        "flex size-6 items-center justify-center rounded-full border",
        variant === "check"
          ? "border-green-600 bg-green-600 text-white"
          : "border-red-600 bg-red-600 text-white",
      )}
    >
      <Icon className="size-3.5" />
    </span>
  );
}
