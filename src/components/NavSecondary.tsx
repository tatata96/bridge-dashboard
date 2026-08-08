import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { getPagePath, type PageId } from "@/config/navigation";
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
                <a
                  href={getPagePath(item.id)}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.id);
                  }}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
