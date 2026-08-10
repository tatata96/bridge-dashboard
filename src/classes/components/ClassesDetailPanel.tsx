import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n";

export function ClassesDetailPanel({
  mode,
  onAddClass,
}: {
  mode: "empty" | "create" | "view";
  onAddClass: () => void;
}) {
  const { t } = useI18n();

  if (mode === "empty") {
    return (
      <div className="flex min-h-64 flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-center">
        <div className="flex max-w-xs flex-col items-center gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-foreground">
              {t("classes.selectClass")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("classes.selectClassDescription")}
            </p>
          </div>
          <Button variant="secondary" onClick={onAddClass}>
            {t("classes.addClass")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-64 flex-1 rounded-lg border border-border bg-background" />
  );
}
