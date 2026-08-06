import { TabsContent } from "@/components/ui/tabs";

export function InsightTab() {
  return (
    <TabsContent
      value="insight"
      className="flex flex-1 items-center justify-center text-sm text-muted-foreground"
    >
      No insight data yet.
    </TabsContent>
  );
}
