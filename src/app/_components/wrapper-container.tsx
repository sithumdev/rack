"use client";

import { ThreeBarsIcon } from "@primer/octicons-react";
import { ActionList, ActionMenu, Label, NavList } from "@primer/react";
import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../_lib/supabase";
import { SIDE_NAVIGATION } from "../_lib/globals";

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
            ? "container relative mx-auto grid grid-cols-12 p-2 lg:p-10"
            : "min-h-screen w-full *:m-0 *:box-border *:p-0"
        )}
      >
        {currentUser && (
          <NavList className="col-span-2 hidden lg:block">
            <NavList.Group>
              {SIDE_NAVIGATION.map((navigation) => (
                <NavList.Item
                  key={navigation.id}
                  onClick={() => navigate(navigation.path)}
                >
                  {navigation.route}
                </NavList.Item>
              ))}

              <NavList.Item onClick={logout}>Logout</NavList.Item>
              <NavList.Item>
                <Label variant="accent">{currentUser?.email}</Label>
              </NavList.Item>
            </NavList.Group>
          </NavList>
        )}
        <div
          className={clsx("lg:p-4 col-span-12 lg:col-span-10 mt-12 lg:mt-0")}
        >
          {children}
        </div>

        {currentUser && (
          <div className="absolute right-2 top-2 lg:hidden">
            <ActionMenu>
              <ActionMenu.Button icon={ThreeBarsIcon}>Menu</ActionMenu.Button>
              <ActionMenu.Overlay width="medium">
                <ActionList>
                  {SIDE_NAVIGATION.map((navigation) => (
                    <ActionList.Item
                      key={navigation.id}
                      onClick={() => navigate(navigation.path)}
                    >
                      {navigation.route}
                    </ActionList.Item>
                  ))}
                  <ActionList.Divider />
                  <ActionList.Item variant="danger" onClick={logout}>
                    Logout
                  </ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </div>
        )}
      </section>
    </>
  );
}
