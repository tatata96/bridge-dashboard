import { type ReactNode } from "react";
import {
  BarChart3Icon,
  BookOpenIcon,
  CalendarDaysIcon,
  PencilLineIcon,
  SettingsIcon,
  StarIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";

export type PageId =
  | "schedule"
  | "business-profile"
  | "classes"
  | "instructors"
  | "performance"
  | "ratings-and-reviews"
  | "support"
  | "account";

export type NavMainItem = {
  id: PageId;
  title: string;
  icon: ReactNode;
  disabled?: boolean;
  tooltip?: string;
};

export type NavSecondaryItem = {
  id: PageId;
  title: string;
  icon: ReactNode;
};

export const defaultPageId: PageId = "schedule";

export const pagePaths: Record<PageId, string> = {
  schedule: "/",
  "business-profile": "/business-profile",
  classes: "/classes",
  instructors: "/instructors",
  performance: "/performance",
  "ratings-and-reviews": "/ratings-and-reviews",
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
    },
    {
      id: "ratings-and-reviews",
      title: "Ratings & reviews",
      icon: <StarIcon />,
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
