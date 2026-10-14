import { type CSSProperties, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import {
  DashboardContentSkeleton,
  FullPageLoading,
} from "@/components/PageLoading";
import { Toaster } from "@/components/Toaster";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PartnerGate } from "@/auth/PartnerGate";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
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
import { ClassTypesPage } from "@/pages/ClassTypes";
import { ClassFormPage } from "@/pages/class-plans/ClassForm";
import { LoginPage } from "@/pages/login/Login";
import { OnboardingPage } from "@/pages/onboarding/Onboarding";
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

function DashboardLayout({
  activePage,
  activePageTitle,
  children,
}: {
  activePage: PageId;
  activePageTitle: string;
  children: ReactNode;
}) {
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
            {children}
          </SidebarInset>
        </SidebarProvider>
      </Toaster>
    </TooltipProvider>
  );
}

function App() {
  const location = useLocation();
  const { t } = useI18n();
  const activePage = getPageFromPathname(location.pathname);
  const activePageTitle = t(pageTitleKeys[activePage]);

  // Keeps the sidebar and header on screen while the session and account
  // load, so a refresh only shows a skeleton in the content area.
  const dashboardLoading = (
    <DashboardLayout activePage={activePage} activePageTitle={activePageTitle}>
      <DashboardContentSkeleton />
    </DashboardLayout>
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute loadingContent={<FullPageLoading />}>
            <PartnerGate
              isOnboardingCompleted={false}
              loadingContent={<FullPageLoading />}
            >
              <OnboardingPage />
            </PartnerGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute loadingContent={dashboardLoading}>
            <PartnerGate
              isOnboardingCompleted
              loadingContent={dashboardLoading}
            >
              <DashboardLayout
                activePage={activePage}
                activePageTitle={activePageTitle}
              >
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
                    element={<ClassTypesPage />}
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
                    element={
                      <PlaceholderPage activePage="ratings-and-reviews" />
                    }
                  />
                  <Route
                    path={getPagePath("support")}
                    element={<PlaceholderPage activePage="support" />}
                  />
                  <Route
                    path={getPagePath("account")}
                    element={<AccountPage />}
                  />
                  <Route
                    path="*"
                    element={
                      <Navigate to={getPagePath(defaultPageId)} replace />
                    }
                  />
                </Routes>
              </DashboardLayout>
            </PartnerGate>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
