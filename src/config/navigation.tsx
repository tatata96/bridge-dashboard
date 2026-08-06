import { type ReactNode } from "react";
import {
  BarChart3Icon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  HomeIcon,
  MegaphoneIcon,
  PencilLineIcon,
  SettingsIcon,
  StarIcon,
  UserCircleIcon,
} from "lucide-react";

export type PageId =
  | "home"
  | "schedule"
  | "appointments"
  | "performance"
  | "ratings"
  | "campaigns"
  | "business-profile"
  | "schedule-settings"
  | "classes"
  | "services"
  | "instructors"
  | "practitioners"
  | "equipment"
  | "smarttools"
  | "support"
  | "account"
  | "internal";

export type NavMainItem = {
  id: PageId;
  title: string;
  icon: ReactNode;
  isActive?: boolean;
  items?: {
    id: PageId;
    title: string;
  }[];
};

export type NavSecondaryItem = {
  id: PageId;
  title: string;
  icon: ReactNode;
};

export const sidebarNavigation: {
  navMain: NavMainItem[];
  navSecondary: NavSecondaryItem[];
} = {
  navMain: [
    {
      id: "home",
      title: "Home",
      icon: <HomeIcon />,
    },
    {
      id: "schedule",
      title: "Schedule",
      icon: <CalendarDaysIcon />,
    },
    {
      id: "appointments",
      title: "Appointments",
      icon: <BriefcaseBusinessIcon />,
    },
    {
      id: "performance",
      title: "Performance",
      icon: <BarChart3Icon />,
      items: [
        {
          id: "performance",
          title: "Overview",
        },
      ],
    },
    {
      id: "ratings",
      title: "Ratings & reviews",
      icon: <StarIcon />,
    },
    {
      id: "campaigns",
      title: "Campaigns",
      icon: <MegaphoneIcon />,
    },
    {
      id: "business-profile",
      title: "Manage",
      icon: <PencilLineIcon />,
      isActive: true,
      items: [
        {
          id: "business-profile",
          title: "Business profile",
        },
        {
          id: "schedule-settings",
          title: "Schedule settings",
        },
        {
          id: "classes",
          title: "Classes",
        },
        {
          id: "services",
          title: "Services",
        },
        {
          id: "instructors",
          title: "Instructors",
        },
        {
          id: "practitioners",
          title: "Practitioners",
        },
        {
          id: "equipment",
          title: "Equipment",
        },
        {
          id: "smarttools",
          title: "SmartTools",
        },
      ],
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
    {
      id: "internal",
      title: "Internal",
      icon: <ChevronDownIcon />,
    },
  ],
};
