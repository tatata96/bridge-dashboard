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
import { BusinessProfilePage } from "@/pages/business-profile";
import { ClassFormPage } from "@/pages/class-plans/ClassForm";
import { AccountPage } from "@/pages/secondary-pages/Account";
import { SchedulePage } from "@/pages/Schedule";
import { ClassPlansPage } from "./pages/ClassPlans";

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
                element={<BusinessProfilePage />}
              />
              <Route
                path={getPagePath("classes")}
                element={<ClassPlansPage />}
              />
              <Route
                path={`${getPagePath("classes")}/add`}
                element={<ClassFormPage key={location.pathname} />}
              />
              <Route
                path={`${getPagePath("classes")}/:classId/edit`}
                element={<ClassFormPage key={location.pathname} />}
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
