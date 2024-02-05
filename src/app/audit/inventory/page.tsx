import { getAllInventoryAudits } from "@/app/_lib/audit/inventory.audit";
import { Spinner } from "@primer/react";
import AuditInventoryTable from "./table";

export default async function InventoryAudits() {
  const { audits } = await getAllInventoryAudits();

  if (audits) {
    return (
      <AuditInventoryTable
        data={audits.map((audit) => ({
          ...audit,
          key: String(audit.id),
        }))}
      />
    );
  }

  return <Spinner />;
}
