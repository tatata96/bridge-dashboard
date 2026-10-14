import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/classnames.utils";

export function NumberStepper({
  id,
  invalid,
  describedBy,
  value,
  onChange,
  min,
  max,
  label,
  className,
}: {
  id?: string;
  invalid?: boolean;
  describedBy?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(String(value));
  }

  function clamp(next: number) {
    let clamped = next;
    if (min !== undefined) {
      clamped = Math.max(min, clamped);
    }
    if (max !== undefined) {
      clamped = Math.min(max, clamped);
    }
    return clamped;
  }

  function step(delta: number) {
    onChange(clamp(value + delta));
  }

  function handleBlur() {
    const parsed = Number(draft);
    if (draft.trim() === "" || Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    onChange(clamp(Math.round(parsed)));
  }

  const atMin = min !== undefined && value <= min;
  const atMax = max !== undefined && value >= max;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Decrease ${label}`}
        disabled={atMin}
        onClick={() => step(-1)}
      >
        <MinusIcon />
      </Button>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        aria-label={label}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={(event) => {
          // Commit the typed value instead of submitting a surrounding form
          // with the previous one.
          if (event.key === "Enter") {
            event.preventDefault();
            handleBlur();
          }
        }}
        className="w-14 text-center"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Increase ${label}`}
        disabled={atMax}
        onClick={() => step(1)}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
