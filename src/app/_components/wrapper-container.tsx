"use client";

import { Label, NavList } from "@primer/react";
import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../_lib/supabase";

export default function WrapperContainer({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User | null;
}) {
  const router = useRouter();

  const logout = async () => {
    await supabaseClient.auth.signOut();
    router.refresh();
  };

  const navigate = (route: string) => {
    router.push(`/${route}`);
  };

  return (
    <>
      <section
        className={clsx(
          currentUser
            ? " grid grid-cols-12 container mx-auto p-10"
            : "*:box-border *:p-0 *:m-0 w-full min-h-screen"
        )}
      >
        {currentUser && (
          <NavList className="col-span-2">
            <NavList.Group>
              <NavList.Item onClick={() => navigate("")}>
                Dashboard
              </NavList.Item>
              <NavList.Item onClick={() => navigate("inventory")}>
                Inventory
              </NavList.Item>
              <NavList.Item onClick={() => navigate("purchases")}>
                Purchase
              </NavList.Item>
              <NavList.Item onClick={() => navigate("releases")}>
                Release
              </NavList.Item>
              <NavList.Item onClick={() => navigate("users")}>
                Users
              </NavList.Item>
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
        )}
        <div
          className={clsx("p-4", currentUser ? "col-span-10" : "col-span-10")}
        >
          {children}
        </div>
      </section>
    </>
  );
}
