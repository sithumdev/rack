"use client";

import { LockOutlined } from "@ant-design/icons";
import { ThreeBarsIcon } from "@primer/octicons-react";
import { ActionList, ActionMenu } from "@primer/react";
import { USER_TYPE } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import { Menu } from "antd";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import {
  SIDEBAR_NAVIGATION_ANT_DESIGN,
  SIDE_NAVIGATION,
} from "../_lib/globals";
import { supabaseClient } from "../_lib/supabase";
import UserCard from "./user-card";

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

  const path = usePathname();

  console.log(path);

  return (
    <>
      <section
        className={clsx(
          currentUser
            ? "relative grid grid-cols-12 p-2 lg:p-5"
            : "min-h-screen w-full *:m-0 *:box-border *:p-0"
        )}
      >
        {currentUser && SIDEBAR_NAVIGATION_ANT_DESIGN && (
          <Menu
            className="col-span-2 hidden lg:block"
            onClick={(e) => {
              if (e.key !== "logout") {
                navigate(e.key);
              }
            }}
            selectedKeys={[path.split("/")[1]]}
            mode="inline"
            items={[
              ...SIDEBAR_NAVIGATION_ANT_DESIGN.filter((navigation) => {
                console.log(currentUser);

                if (currentUser.user_metadata.type === USER_TYPE.EMPLOYEE) {
                  console.log(navigation);

                  if (
                    navigation &&
                    navigation.key &&
                    [
                      "inventory",
                      "purchases",
                      "releases",
                      "products",
                      "categories",
                      "downloads",
                    ].includes(navigation.key.toString())
                  ) {
                    return true;
                  }
                  return false;
                }
                return true;
              }),
              {
                key: "user",
                label: <UserCard user={currentUser} />,
              },
              {
                key: "logout",
                icon: <LockOutlined />,
                label: "Logout",
                danger: true,
                onClick: () => logout(),
              },
            ]}
          />
        )}

        {/* {currentUser && (
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
        )} */}

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
