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
  pageTitleKeys,
  sidebarNavigation,
  type PageId,
} from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
import { AddClassPage } from "@/pages/classes/AddClass";
import { ClassesPage } from "@/pages/Classes";
import { AccountPage } from "@/pages/secondary-pages/Account";
import { SchedulePage } from "@/pages/Schedule";

function PlaceholderPage({ activePage }: { activePage: PageId }) {
  const { t } = useI18n();

  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold tracking-normal">
        {t(pageTitleKeys[activePage])}
      </h2>
    </main>
  );
}

function App() {
  const location = useLocation();
  const { t } = useI18n();
  const activePage = getPageFromPathname(location.pathname);
  const activePageTitle = t(pageTitleKeys[activePage]);

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
            <SiteHeader title={activePageTitle} />
            <Routes>
              <Route
                path={getPagePath("schedule")}
                element={<SchedulePage />}
              />
              <Route
                path={getPagePath("business-profile")}
                element={<PlaceholderPage activePage="business-profile" />}
              />
              <Route path={getPagePath("classes")} element={<ClassesPage />} />
              <Route
                path={`${getPagePath("classes")}/add`}
                element={<AddClassPage />}
              />
              <Route
                path={getPagePath("class-types")}
                element={<PlaceholderPage activePage="class-types" />}
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
              <Route path={getPagePath("account")} element={<AccountPage />} />
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
