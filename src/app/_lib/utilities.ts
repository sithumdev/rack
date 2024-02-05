import { AUDIT_ACTION, USER_TYPE } from "@prisma/client";
import { ReportMode } from "./globals";

export function getPermissionByName(name: string) {
  switch (name) {
    case USER_TYPE.EMPLOYEE.toString():
      return USER_TYPE.EMPLOYEE;
    case USER_TYPE.MANAGER.toString():
      return USER_TYPE.MANAGER;
    case USER_TYPE.OWNER.toString():
      return USER_TYPE.OWNER;
    case USER_TYPE.SUPPLIER.toString():
      return USER_TYPE.SUPPLIER;
    default:
      throw Error("Role not defined");
  }
}

export function getReportModeByName(name: string) {
  switch (name) {
    case ReportMode.DAILY.toString():
      return ReportMode.DAILY;
    case ReportMode.WEEKLY.toString():
      return ReportMode.WEEKLY;
    case ReportMode.MONTHLY.toString():
      return ReportMode.MONTHLY;
    case ReportMode.YEARLY.toString():
      return ReportMode.YEARLY;
    default:
      throw Error("Mode not defined");
  }
}

export function getAntDesignTagColor(action: AUDIT_ACTION): string {
  switch (action) {
    case "CREATE":
      return "geekblue";
    case "UPDATE":
      return "gold";
    case "DELETE":
      return "error";
    default:
      throw new Error("Invalid action");
  }
}
