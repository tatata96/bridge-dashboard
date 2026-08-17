import { cn } from "@/lib/classnames.utils";
import type { ClassStatus } from "@/types/classes";

export function ClassStatusIndicator({
  status,
  label,
  className,
}: {
  status: ClassStatus;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <span
        title={label}
        aria-hidden="true"
        className={cn(
          "block size-2 rounded-full",
          status === "active"
            ? "bg-muted-foreground"
            : "border border-muted-foreground",
        )}
      />
      {label}
    </span>
  );
}
