"use client";

import { NavList } from "@primer/react";
import { supabaseClient } from "../lib/supabase";

export default function WrapperContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="grid grid-cols-12 container mx-auto p-10">
        <NavList className="col-span-2">
          <NavList.LeadingVisual>Hello</NavList.LeadingVisual>
          <NavList.Group>
            <NavList.Item>Dashboard</NavList.Item>
            <NavList.Item>Users</NavList.Item>

            <NavList.Item
              onClick={async () => {
                await supabaseClient.auth.signOut();
              }}
            >
              Logout
            </NavList.Item>
          </NavList.Group>
        </NavList>
        <div className="col-span-10 p-4">{children}</div>
      </section>
    </>
  );
}
