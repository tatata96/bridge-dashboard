import { type ComponentProps } from "react";
import { Link } from "react-router-dom";

import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";
import { APP_NAME } from "@/config/constants";
import type {
  NavMainItem,
  NavSecondaryItem,
  PageId,
} from "@/config/navigation";
import { getPagePath } from "@/config/navigation";
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
  ...props
}: ComponentProps<typeof Sidebar> & {
  activePage: PageId;
  navMain: NavMainItem[];
  navSecondary: NavSecondaryItem[];
}) {
  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={getPagePath("schedule")}>
                <img
                  src="/logo.svg"
                  alt=""
                  className="size-8 shrink-0 rounded-[22%]"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xl font-semibold tracking-normal">
                    {APP_NAME}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} activePage={activePage} />
        <NavSecondary
          items={navSecondary}
          activePage={activePage}
          className="mt-auto px-2"
        />
      </SidebarContent>
    </Sidebar>
  );
}
