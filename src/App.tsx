import { type CSSProperties } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/Toaster";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  defaultPageId,
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
  performance: "Performance",
  "ratings-and-reviews": "Ratings & reviews",
  support: "Support",
  account: "Account",
};

function PlaceholderPage({ activePage }: { activePage: PageId }) {
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold tracking-normal">
        {pageTitles[activePage]}
      </h2>
    </main>
  );
}

function App() {
  const location = useLocation();
  const activePage = getPageFromPathname(location.pathname);

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
          />
          <SidebarInset className="min-h-svh bg-muted/30">
            <SiteHeader title={pageTitles[activePage]} />
            <Routes>
              <Route
                path={getPagePath("schedule")}
                element={<SchedulePage />}
              />
              <Route
                path={getPagePath("business-profile")}
                element={<PlaceholderPage activePage="business-profile" />}
              />
              <Route
                path={getPagePath("classes")}
                element={<PlaceholderPage activePage="classes" />}
              />
              <Route
                path={getPagePath("instructors")}
                element={<PlaceholderPage activePage="instructors" />}
              />
              <Route
                path={getPagePath("performance")}
                element={<PlaceholderPage activePage="performance" />}
              />
              <Route
                path={getPagePath("ratings-and-reviews")}
                element={<PlaceholderPage activePage="ratings-and-reviews" />}
              />
              <Route
                path={getPagePath("support")}
                element={<PlaceholderPage activePage="support" />}
              />
              <Route
                path={getPagePath("account")}
                element={<PlaceholderPage activePage="account" />}
              />
              <Route
                path="*"
                element={<Navigate to={getPagePath(defaultPageId)} replace />}
              />
            </Routes>
          </SidebarInset>
        </SidebarProvider>
      </Toaster>
    </TooltipProvider>
  );
}

export default App;
