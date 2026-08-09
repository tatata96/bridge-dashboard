import { Link } from "react-router-dom";

import {
  getPagePath,
  type NavMainItem,
  type PageId,
} from "@/config/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  activePage,
}: {
  items: NavMainItem[];
  activePage: PageId;
}) {
  return (
    <SidebarGroup className="px-2">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={
                item.disabled
                  ? { children: item.tooltip ?? "Coming soon", hidden: false }
                  : item.title
              }
              isActive={item.id === activePage}
              className={
                item.disabled
                  ? "cursor-not-allowed font-medium opacity-50"
                  : "font-medium"
              }
            >
              {item.disabled ? (
                <span tabIndex={0} aria-disabled="true">
                  {item.icon}
                  <span>{item.title}</span>
                </span>
              ) : (
                <Link to={getPagePath(item.id)}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
