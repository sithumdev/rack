import { USER_TYPE } from "@prisma/client";

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
