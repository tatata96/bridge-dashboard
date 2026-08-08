import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import type { PageId } from "@/config/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  activePage,
  onNavigate,
  ...props
}: {
  items: {
    id: PageId;
    title: string;
    icon: ReactNode;
  }[];
  activePage: PageId;
  onNavigate: (page: PageId) => void;
} & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
                isActive={item.id === activePage}
              >
                <button type="button" onClick={() => onNavigate(item.id)}>
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
