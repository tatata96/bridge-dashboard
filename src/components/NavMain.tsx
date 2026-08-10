import { Link } from "react-router-dom";

import {
  getPagePath,
  pageTitleKeys,
  type NavMainItem,
  type PageId,
} from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
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
  const { t } = useI18n();

  return (
    <SidebarGroup className="px-2">
      <SidebarMenu>
        {items.map((item) => {
          const title = t(pageTitleKeys[item.id]);

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                tooltip={
                  item.disabled
                    ? { children: t("common.comingSoon"), hidden: false }
                    : title
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
                    <span>{title}</span>
                  </span>
                ) : (
                  <Link to={getPagePath(item.id)}>
                    {item.icon}
                    <span>{title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
