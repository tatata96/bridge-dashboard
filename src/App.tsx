import { useEffect, useState, type CSSProperties } from "react";

import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/Toaster";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  getPageFromPathname,
  getPagePath,
  sidebarNavigation,
  type PageId,
} from "@/config/navigation";
import { SchedulePage } from "@/pages/Schedule";

const pageTitles: Record<PageId, string> = {
  schedule: "Schedule",
  "business-profile": "Business profile",
  classes: "Classes",
  instructors: "Instructors",
  support: "Support",
  account: "Account",
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
  const [activePage, setActivePage] = useState<PageId>(() =>
    getPageFromPathname(window.location.pathname),
  );

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getPageFromPathname(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function handleNavigate(page: PageId) {
    const nextPath = getPagePath(page);

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, "", nextPath);
    }

    setActivePage(page);
  }

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
            onNavigate={handleNavigate}
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
