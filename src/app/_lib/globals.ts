import { MenuProps } from "antd";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
export const TABLE_ROW_SIZE = 10;
export const INVENTORY_LEVEL = {
  LOW: 100,
  DANGER: 20,
};

export enum ReportMode {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEAR;Y",
}

type ISideNavigation = {
  id: number;
  route: string;
  path: string;
};

export const SIDE_NAVIGATION: ISideNavigation[] = [
  {
    id: 1,
    path: "",
    route: "Dashboard",
  },
  {
    id: 2,
    path: "inventory",
    route: "Inventory",
  },
  {
    id: 3,
    path: "purchases",
    route: "Purchases",
  },
  {
    id: 4,
    path: "releases",
    route: "Releases",
  },
  {
    id: 5,
    path: "users",
    route: "Users",
  },
  {
    id: 6,
    path: "products",
    route: "Products",
  },
  {
    id: 7,
    path: "categories",
    route: "Categories",
  },
  {
    id: 8,
    path: "downloads",
    route: "Downloads",
  },
];

export const SIDEBAR_NAVIGATION_ANT_DESIGN: MenuProps["items"] = [
  {
    key: "reports",
    label: "Dashboard",
  },
  {
    key: "inventory",
    label: "Inventory",
  },
  {
    key: "purchases",
    label: "Purchase",
  },
  {
    key: "releases",
    label: "Release",
  },
  {
    key: "products",
    label: "Products",
  },
  {
    key: "categories",
    label: "Categories",
  },
  {
    key: "downloads",
    label: "Downloads",
  },
  {
    key: "users",
    label: "Users",
  },
  {
    key: "audit",
    label: "Audit",
  },
  { type: "divider" },
];
