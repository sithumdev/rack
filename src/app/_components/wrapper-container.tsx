"use client";

import { NavList } from "@primer/react";
import { supabaseClient } from "../_lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function WrapperContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await supabaseClient.auth.signOut();
    router.refresh();
  };

  if (pathname === "/login") {
    return <section className="w-full min-h-screen">{children}</section>;
  }

  return (
    <>
      <section className="grid grid-cols-12 container mx-auto p-10">
        <NavList className="col-span-2">
          <NavList.LeadingVisual>Hello</NavList.LeadingVisual>
          <NavList.Group>
            <NavList.Item>
              <Link href="/">Dashboard</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/businesses">Businesses</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/users">Users</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/products">Products</Link>
            </NavList.Item>

            <NavList.Item onClick={logout}>Logout</NavList.Item>
          </NavList.Group>
        </NavList>
        <div className="col-span-10 p-4">{children}</div>
      </section>
    </>
  );
}
