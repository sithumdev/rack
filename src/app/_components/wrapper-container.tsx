"use client";

import { FormControl, NavList, Select } from "@primer/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseClient } from "../_lib/supabase";
import { Business } from "@prisma/client";
import { useEffect } from "react";
import { useBusinessStore } from "../_store";
import { User } from "@supabase/supabase-js";

export default function WrapperContainer({
  children,
  businesses,
  currentUser,
}: {
  children: React.ReactNode;
  businesses: Business[];
  currentUser: User | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const selectBusiness = useBusinessStore((state) => state.selectBusiness);

  const selectedBusiness = useBusinessStore((state) => state.business);

  const logout = async () => {
    await supabaseClient.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
    if (businesses.length > 0) {
      selectBusiness(businesses[0]);
    }
  }, [businesses, selectBusiness]);

  const pickBusiness = (businessId: string) => {
    const foundBusiness = businesses.find(
      (busines) => busines.id === Number(businessId)
    );

    if (foundBusiness) {
      selectBusiness(foundBusiness);
    }
  };

  if (pathname === "/login") {
    return <section className="w-full min-h-screen">{children}</section>;
  }

  return (
    <>
      <section className="grid grid-cols-12 container mx-auto p-10">
        <NavList className="col-span-2">
          <FormControl>
            <FormControl.Label>Business</FormControl.Label>
            <Select
              defaultValue={selectedBusiness?.id.toString()}
              onChange={(e) => pickBusiness(e.target.value)}
            >
              {businesses.map((business) => (
                <Select.Option key={business.id} value={business.id.toString()}>
                  {business.name}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
          <NavList.Group>
            <NavList.Item>
              <Link href="/">Dashboard</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/businesses">Businesses</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/inventory">Inventory</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/purchases">Purchase</Link>
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

            <NavList.Item>
              <Link href="/brands">Brands</Link>
            </NavList.Item>

            <NavList.Item>
              <Link href="/permissions">Permissions</Link>
            </NavList.Item>

            <NavList.Item onClick={logout}>Logout</NavList.Item>
            <NavList.Item>
              <p>{currentUser?.email}</p>
            </NavList.Item>
          </NavList.Group>
        </NavList>
        <div className="col-span-10 p-4">{children}</div>
      </section>
    </>
  );
}
