import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useI18n } from "@/i18n/i18n";
import { PanelLeftIcon } from "lucide-react";

export function SiteHeader({ title }: { title: string }) {
  const { toggleSidebar } = useSidebar();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background shadow-xs">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={t("common.toggleSidebar")}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <h1 className="min-w-0 flex-1 truncate text-xl font-semibold tracking-normal">
          {title}
        </h1>
      </div>
    </header>
  );
}
