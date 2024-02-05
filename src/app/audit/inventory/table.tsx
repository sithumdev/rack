"use client";

import { getAntDesignTagColor } from "@/app/_lib/utilities";
import { AuditDifference, InventoryAudit } from "@prisma/client";
import { Descriptions, Table, TableProps, Tag, Timeline } from "antd";
import moment from "moment";

export interface TableCellType extends InventoryAudit {
  key: string;
  differences: AuditDifference[];
}

type IAuditInventoryTable = {
  data: TableCellType[];
};

const COLUMNS: TableProps<TableCellType>["columns"] = [
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text) => <Tag color={getAntDesignTagColor(text)}>{text}</Tag>,
  },
  {
    title: "Inventory",
    dataIndex: "productName",
    key: "productName",
    render: (productName) => <span>{productName}</span>,
  },
  {
    title: "Performed By",
    dataIndex: "performedBy",
    key: "performedBy",
  },
  {
    title: "Performed At",
    dataIndex: "performedAt",
    key: "performedAt",
    render: (performedAt) => (
      <span>{moment(performedAt).format("YYYY-MM-DD hh:mm:ss a")}</span>
    ),
    align: "right",
  },
];

export default function AuditInventoryTable({ data }: IAuditInventoryTable) {
  return (
    <Table
      bordered
      columns={COLUMNS}
      dataSource={data}
      expandable={{
        expandedRowRender: (record) => (
          <>
            <Descriptions title={record.productName}>
              <Descriptions.Item label="Max Retail Price">
                {record.mrp}
              </Descriptions.Item>
            </Descriptions>
            <Timeline
              className="mt-2"
              items={record.differences.map((difference) => ({
                children: `field ${difference.path} updated to ${difference.rhs} from ${difference.lhs}`,
              }))}
            />
          </>
        ),
      }}
    />
  );
}
