"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Image from "next/image";
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
    <div className="grid h-full min-h-screen w-full grid-cols-2">
      <div className="relative hidden h-full w-full overflow-hidden lg:flex">
        <Image src={Shape} alt="Shape" className="h-full w-full" />
      </div>

      <div className="col-span-2 flex flex-col gap-5 p-10 lg:col-span-1">
        <div className="mobile-shape lg:hidden">
          <Image src={Shape} alt="Shape" width="100" height="100" />
        </div>

        <h3 className="text-xl">Welcome to {APP_NAME} Inventory Platform</h3>
        <p className="text-xs">
          Please log in to access your account and manage inventory efficiently.
        </p>

        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#1f883d",
                  inputBackground: "#ffffff",
                },
              },
            },
          }}
          theme="dark"
          showLinks={false}
          providers={[]}
          redirectTo="http://localhost:3000/auth/callback"
        />
      </div>
    </div>
  );
}
