import { PERMISSION_LEVEL } from "@prisma/client";

export function getPermissionByName(name: string) {
  switch (name) {
    case PERMISSION_LEVEL.BUSINESS.toString():
      return PERMISSION_LEVEL.BUSINESS;
    case PERMISSION_LEVEL.EMPLOYEE.toString():
      return PERMISSION_LEVEL.EMPLOYEE;
    case PERMISSION_LEVEL.INVENTORY.toString():
      return PERMISSION_LEVEL.INVENTORY;
    default:
      throw Error("Permission not defined");
  }
}
