import { Breadcrumb } from "antd";
import RoutesTable from "../_features/routes/table";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: "Routes",
          },
        ]}
      />
      {children}
    </>
  );
}

export default function Routes() {
  return (
    <Wrapper>
      <RoutesTable />
    </Wrapper>
  );
}
