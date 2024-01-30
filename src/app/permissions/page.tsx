import { Spinner } from "@primer/react";
import { PermissionsTable } from "../_features/permissions";
import { getPermissions } from "../_lib/permissions";

export default async function Permissions() {
  const { permissions } = await getPermissions();

  if (permissions) {
    return <PermissionsTable rows={permissions} />;
  }

  return <Spinner />;
}
