"use client";

import { Label, NavList } from "@primer/react";
import { User } from "@supabase/supabase-js";
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

  const navigate = (route: string) => {
    router.push(`/${route}`);
  };

  if (pathname === "/login") {
    return <section className="w-full min-h-screen">{children}</section>;
  }

  return (
    <>
      <section className="grid grid-cols-12 container mx-auto p-10">
        <NavList className="col-span-2">
          <NavList.Group>
            <NavList.Item onClick={() => navigate("")}>Dashboard</NavList.Item>
            <NavList.Item onClick={() => navigate("inventory")}>
              Inventory
            </NavList.Item>
            <NavList.Item onClick={() => navigate("purchases")}>
              Purchase
            </NavList.Item>
            <NavList.Item onClick={() => navigate("releases")}>
              Release
            </NavList.Item>
            <NavList.Item onClick={() => navigate("users")}>Users</NavList.Item>
            <NavList.Item onClick={() => navigate("products")}>
              Products
            </NavList.Item>
            <NavList.Item onClick={() => navigate("categories")}>
              Category
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
