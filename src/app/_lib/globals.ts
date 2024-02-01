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
