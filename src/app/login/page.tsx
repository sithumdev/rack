"use client";

import { Button } from "@primer/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { APP_NAME } from "../_lib/globals";
import Shape from "./images/shape.svg";

// TODO: Move
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function Login() {
  const supabase = createClientComponentClient();

  return (
    <div className="grid grid-cols-2 w-full h-full min-h-screen">
      <div className="overflow-hidden relative w-full h- hidden lg:flex">
        <Image src={Shape} alt="Shape" layout="fill" />
      </div>

      <div className="flex flex-col gap-5">
        <div className="mobile-shape lg:hidden">
          <Image src={Shape} alt="Shape" width="100" height="100" />
        </div>

        <h3 className="text-xl">Welcome to {APP_NAME} Inventory Platform</h3>
        <p className="text-xs">
          Please log in to access your account and manage human resources
          efficiently.
        </p>

        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{ theme: ThemeMinimal }}
          theme="dark"
          showLinks={false}
          providers={[]}
          redirectTo="http://localhost:3000/auth/callback"
        />

        <div className="flex items-center gap-5 text-sm text-blue-500">
          <Link href="/auth/forgot-password">Forgot password?</Link>
          <Link href="/help">Need Help? Contact Support</Link>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button size="large" variant="default">
            Sign Up
          </Button>
          <Button type="submit" size="large" variant="primary">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
