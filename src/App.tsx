import { useState, type CSSProperties } from "react";

import { AppSidebar } from "#components/app-sidebar";
import { SiteHeader } from "#components/site-header";
import { SidebarInset, SidebarProvider } from "#components/ui/sidebar";
import { TooltipProvider } from "#components/ui/tooltip";
import { sidebarNavigation, type PageId } from "#config/navigation";

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

function App() {
  const [activePage, setActivePage] = useState<PageId>("schedule-settings");

  return (
    <TooltipProvider>
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
          <div className="p-6">
            <section className="min-h-112 border bg-background p-8">
              <h2 className="text-2xl font-semibold tracking-normal">
                {pageTitles[activePage]}
              </h2>
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
