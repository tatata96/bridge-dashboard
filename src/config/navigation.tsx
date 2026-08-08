import { type ReactNode } from "react";
import {
  BarChart3Icon,
  BookOpenIcon,
  CalendarDaysIcon,
  PencilLineIcon,
  SettingsIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";

export type PageId =
  | "schedule"
  | "business-profile"
  | "classes"
  | "instructors"
  | "support"
  | "account";

export type NavMainItem =
  | {
      id: PageId;
      title: string;
      icon: ReactNode;
      disabled?: false;
    }
  | {
      id: "performance";
      title: string;
      icon: ReactNode;
      disabled: true;
      tooltip: string;
    };

export type NavSecondaryItem = {
  id: PageId;
  title: string;
  icon: ReactNode;
};

export const defaultPageId: PageId = "schedule";

export const pagePaths: Record<PageId, string> = {
  schedule: "/",
  "business-profile": "/manage/business-profile",
  classes: "/manage/classes",
  instructors: "/manage/instructors",
  support: "/support",
  account: "/account",
};

const pathPageIds = Object.entries(pagePaths).reduce<Record<string, PageId>>(
  (paths, [pageId, path]) => {
    paths[path] = pageId as PageId;
    return paths;
  },
  {},
);

export function getPagePath(pageId: PageId) {
  return pagePaths[pageId];
}

export function getPageFromPathname(pathname: string): PageId {
  return pathPageIds[pathname] ?? defaultPageId;
}

export const sidebarNavigation: {
  navMain: NavMainItem[];
  navSecondary: NavSecondaryItem[];
} = {
  navMain: [
    {
      id: "schedule",
      title: "Schedule",
      icon: <CalendarDaysIcon />,
    },
    {
      id: "business-profile",
      title: "Business profile",
      icon: <PencilLineIcon />,
    },
    {
      id: "classes",
      title: "Classes",
      icon: <BookOpenIcon />,
    },
    {
      id: "instructors",
      title: "Instructors",
      icon: <UsersIcon />,
    },
    {
      id: "performance",
      title: "Performance",
      icon: <BarChart3Icon />,
      disabled: true,
      tooltip: "Coming soon",
    },
  ],
  navSecondary: [
    {
      id: "support",
      title: "Support",
      icon: <UserCircleIcon />,
    },
    {
      id: "account",
      title: "Account",
      icon: <SettingsIcon />,
    },
  ],
};
