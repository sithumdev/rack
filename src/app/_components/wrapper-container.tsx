"use client";

import { Label, NavList } from "@primer/react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseClient } from "../_lib/supabase";

export default function WrapperContainer({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User | null;
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
          <NavList.Group>
            <NavList.Item>
              <Link href="/">Dashboard</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/inventory">Inventory</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/purchases">Purchase</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/releases">Release</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/users">Users</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/products">Products</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/categories">Category</Link>
            </NavList.Item>

            <NavList.Item onClick={logout}>Logout</NavList.Item>
            <NavList.Item>
              <Label variant="accent">{currentUser?.email}</Label>
            </NavList.Item>
          </NavList.Group>
        </NavList>
        <div className="col-span-10 p-4">{children}</div>
      </section>
    </>
  );
}
