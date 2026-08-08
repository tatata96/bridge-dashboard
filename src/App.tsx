import { useState, type CSSProperties } from "react";

import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/Toaster";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { sidebarNavigation, type PageId } from "@/config/navigation";
import { SchedulePage } from "@/pages/Schedule";

const pageTitles: Record<PageId, string> = {
  home: "Home",
  schedule: "Schedule",
  appointments: "Appointments",
  performance: "Performance",
  ratings: "Ratings & reviews",
  campaigns: "Campaigns",
  "business-profile": "Business profile",
  "schedule-settings": "Schedule settings",
  classes: "Classes",
  services: "Services",
  instructors: "Instructors",
  practitioners: "Practitioners",
  equipment: "Equipment",
  smarttools: "SmartTools",
  support: "Support",
  account: "Account",
  internal: "Internal",
};

function PageContentRenderer({ activePage }: { activePage: PageId }) {
  if (activePage === "schedule") {
    return <SchedulePage />;
  }

  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold tracking-normal">
        {pageTitles[activePage]}
      </h2>
    </main>
  );
}

function App() {
  const [activePage, setActivePage] = useState<PageId>("schedule-settings");

  return (
    <TooltipProvider>
      <Toaster>
        <SidebarProvider
          style={
            {
              "--header-height": "4.5rem",
              "--sidebar-width": "13.75rem",
            } as CSSProperties
          }
        >
          <AppSidebar
            activePage={activePage}
            navMain={sidebarNavigation.navMain}
            navSecondary={sidebarNavigation.navSecondary}
            onNavigate={setActivePage}
          />
          <SidebarInset className="min-h-svh bg-muted/30">
            <SiteHeader title={pageTitles[activePage]} />
            <PageContentRenderer activePage={activePage} />
          </SidebarInset>
        </SidebarProvider>
      </Toaster>
    </TooltipProvider>
  );
}

export default App;
