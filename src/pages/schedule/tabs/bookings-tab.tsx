import { CalendarIcon } from "lucide-react";

import { TabsContent } from "@/components/ui/tabs";

export function BookingsTab() {
  return (
    <TabsContent
      value="bookings"
      className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground"
    >
      <CalendarIcon className="size-8 text-muted-foreground/50" />
      <p>This class has no reservations.</p>
      <p>Please check back later.</p>
    </TabsContent>
  );
}
