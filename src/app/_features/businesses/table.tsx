"use client";

import { useBusinessStore } from "@/app/_store";
import { Button, IssueLabelToken, Label, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Business, User } from "@prisma/client";
import { useCallback, useState } from "react";
import { CreateUpdateBusiness } from ".";

type IBusinessesTable = {
  rows: Business[];
  currentUser: User;
};

export default function BusinessesTable({
  rows,
  currentUser,
}: IBusinessesTable) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedBusiness = useBusinessStore((state) => state.business);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Businesses
        </Table.Title>
        <Table.Actions>
          <Button onClick={onDialogOpen}>Create Business</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Businesses managed by the admin
        </Table.Subtitle>
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={rows}
          columns={[
            {
              header: "Name",
              field: "name",
              renderCell: (row) => {
                return (
                  <div className="flex items-center gap-1">
                    {selectedBusiness?.id === row.id && (
                      <span className="bg-green-500 w-2 h-2 rounded-full" />
                    )}
                    <p>{row.name}</p>
                  </div>
                );
              },
            },
            {
              header: "Email Address",
              field: "email",
              renderCell: (row) => {
                return <Label>{row.email}</Label>;
              },
            },
            {
              header: "Status",
              field: "isActive",
              renderCell: (row) => {
                return (
                  <IssueLabelToken
                    size="small"
                    fillColor={row.isActive ? "green" : "red"}
                    text={row.isActive ? "Active" : "Inactive"}
                  />
                );
              },
            },
            {
              header: "Updated",
              field: "updatedAt",
              renderCell: (row) => {
                return <RelativeTime date={new Date(row.updatedAt)} />;
              },
            },
          ]}
        />
      </Table.Container>
      <CreateUpdateBusiness
        open={isOpen}
        onClose={onDialogClose}
        currentUser={currentUser}
      />
    </>
  );
}
