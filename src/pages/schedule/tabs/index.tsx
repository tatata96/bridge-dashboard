import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsTab } from "@/pages/schedule/tabs/bookings-tab";
import { InsightTab } from "@/pages/schedule/tabs/insight-tab";
import type { Reservation } from "@/types/schedule";

export function ScheduleDetailTabs({
  reservations,
}: {
  reservations: Reservation[];
}) {
  return (
    <Tabs defaultValue="bookings" className="flex flex-1 flex-col">
      <TabsList variant="line">
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="insight">Insight</TabsTrigger>
      </TabsList>
      <BookingsTab reservations={reservations} />
      <InsightTab />
    </Tabs>
  );
}
