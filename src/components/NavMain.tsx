import { type ReactNode } from "react";

import type { PageId } from "@/config/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";

export function NavMain({
  items,
  activePage,
  onNavigate,
}: {
  items: {
    id: PageId;
    title: string;
    icon: ReactNode;
    isActive?: boolean;
    items?: {
      id: PageId;
      title: string;
    }[];
  }[];
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}) {
  return (
    <SidebarGroup className="px-2">
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={
              item.isActive ||
              item.items?.some((subItem) => subItem.id === activePage)
            }
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.id === activePage}
                className="font-medium"
              >
                <button type="button" onClick={() => onNavigate(item.id)}>
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRightIcon />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={subItem.id === activePage}
                          >
                            <button
                              type="button"
                              onClick={() => onNavigate(subItem.id)}
                            >
                              <span>{subItem.title}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
