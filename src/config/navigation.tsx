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

import type { TranslationKey } from "@/i18n/i18n";

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
  icon: ReactNode;
  disabled?: boolean;
};

export type NavSecondaryItem = {
  id: PageId;
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

export const pageTitleKeys = {
  schedule: "nav.schedule",
  "business-profile": "nav.businessProfile",
  classes: "nav.classes",
  instructors: "nav.instructors",
  performance: "nav.performance",
  "ratings-and-reviews": "nav.ratingsAndReviews",
  support: "nav.support",
  account: "nav.account",
} satisfies Record<PageId, TranslationKey>;

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
      icon: <CalendarDaysIcon />,
    },
    {
      id: "business-profile",
      icon: <PencilLineIcon />,
    },
    {
      id: "classes",
      icon: <BookOpenIcon />,
    },
    {
      id: "instructors",
      icon: <UsersIcon />,
    },
    {
      id: "performance",
      icon: <BarChart3Icon />,
    },
    {
      id: "ratings-and-reviews",
      icon: <StarIcon />,
    },
  ],
  navSecondary: [
    {
      id: "support",
      icon: <UserCircleIcon />,
    },
    {
      id: "account",
      icon: <SettingsIcon />,
    },
  ],
};
