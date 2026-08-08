import { type ComponentProps } from "react";

import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";
import { APP_NAME } from "@/config/constants";
import type {
  NavMainItem,
  NavSecondaryItem,
  PageId,
} from "@/config/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({
  activePage,
  navMain,
  navSecondary,
  onNavigate,
  ...props
}: ComponentProps<typeof Sidebar> & {
  activePage: PageId;
  navMain: NavMainItem[];
  navSecondary: NavSecondaryItem[];
  onNavigate: (page: PageId) => void;
}) {
  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xl font-semibold tracking-normal">
                    {APP_NAME}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMain}
          activePage={activePage}
          onNavigate={onNavigate}
        />
        <NavSecondary
          items={navSecondary}
          activePage={activePage}
          onNavigate={onNavigate}
          className="mt-auto px-2"
        />
      </SidebarContent>
    </Sidebar>
  );
}
