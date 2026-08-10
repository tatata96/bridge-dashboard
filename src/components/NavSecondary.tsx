import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { getPagePath, pageTitleKeys, type PageId } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
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
  ...props
}: {
  items: {
    id: PageId;
    icon: ReactNode;
  }[];
  activePage: PageId;
} & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { t } = useI18n();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                size="sm"
                isActive={item.id === activePage}
              >
                <Link to={getPagePath(item.id)}>
                  {item.icon}
                  <span>{t(pageTitleKeys[item.id])}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
