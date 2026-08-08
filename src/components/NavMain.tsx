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
  onNavigate,
}: {
  items: NavMainItem[];
  activePage: PageId;
  onNavigate: (page: PageId) => void;
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
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
