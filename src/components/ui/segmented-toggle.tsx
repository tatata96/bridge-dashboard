import { type ReactNode } from "react";

import { cn } from "@/lib/classnames.utils";

export type SegmentedToggleOption<TValue extends string> = {
  value: TValue;
  label: ReactNode;
  ariaLabel?: string;
};

export function SegmentedToggle<TValue extends string>({
  value,
  options,
  onValueChange,
  "aria-label": ariaLabel,
  className,
}: {
  value: TValue;
  options: SegmentedToggleOption<TValue>[];
  onValueChange: (value: TValue) => void;
  "aria-label": string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-10 w-fit items-center rounded-md border border-input bg-input/30 p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-label={option.ariaLabel}
            aria-checked={isSelected}
            className={cn(
              "flex h-8 min-w-14 cursor-pointer items-center justify-center rounded-[calc(var(--radius-md)-2px)] px-3 text-sm font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "hover:text-foreground",
              isSelected &&
                "border border-border bg-background text-foreground shadow-xs",
            )}
            onClick={() => onValueChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
