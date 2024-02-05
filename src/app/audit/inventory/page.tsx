import { getAllInventoryAudits } from "@/app/_lib/audit/inventory.audit";
import { Empty } from "antd";
import AuditInventoryTable from "./table";

export default async function InventoryAudits() {
  const { audits } = await getAllInventoryAudits();

  if (audits && audits.length > 0) {
    return (
      <AuditInventoryTable
        data={audits.map((audit) => ({
          ...audit,
          key: String(audit.id),
        }))}
      />
    );
  }

  return <Empty />;
}
