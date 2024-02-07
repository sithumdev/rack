import { Breadcrumb } from "antd";
import CustomersTable from "../_features/customers/table";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: "Customers",
          },
        ]}
      />
      {children}
    </>
  );
}

export default function Customers() {
  return (
    <Wrapper>
      <CustomersTable />
    </Wrapper>
  );
}
