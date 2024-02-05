import { Card, Space } from "antd";
import Link from "next/link";

export default function Audit() {
  return (
    <Space direction="horizontal" size="large" style={{ display: "flex" }}>
      <Card
        title="Inventory Audit"
        size="default"
        extra={<Link href="audit/inventory">More</Link>}
      >
        <p>Complete history of each inventory item</p>
      </Card>
      <Card
        title="Purchase Audit"
        size="default"
        extra={<Link href="audit/purchase">More</Link>}
      >
        <p>Complete history of past purchases</p>
      </Card>
      <Card
        title="Release Audit"
        size="default"
        extra={<Link href="audit/release">More</Link>}
      >
        <p>Complete history of past releases</p>
      </Card>
    </Space>
  );
}
