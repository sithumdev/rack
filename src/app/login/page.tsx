"use client";

import { Button, Form, Stack, TextInput } from "@carbon/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { supabaseClient } from "../lib/supabase";
import { APP_NAME } from "../lib/globals";
import Shape from "./images/shape.svg";
import { useRouter } from "next/navigation";

// TODO: Move
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    try {
      const { data: payload, error } =
        await supabaseClient.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (payload) {
        router.refresh();
      }

      if (error) throw error;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack className="grid grid-cols-2 w-full h-full min-h-screen">
      <div className="overflow-hidden relative w-full h- hidden lg:flex">
        <Image src={Shape} alt="Shape" layout="fill" />
      </div>
      <Form
        aria-label="Login Form"
        className="p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack gap={7}>
          <div className="mobile-shape lg:hidden">
            <Image src={Shape} alt="Shape" width="100" height="100" />
          </div>

          <h3 className="text-xl">Welcome to {APP_NAME} Inventory Platform</h3>
          <p className="text-xs">
            Please log in to access your account and manage human resources
            efficiently.
          </p>
          <TextInput
            id="email"
            labelText="Email address"
            placeholder="Email address"
            {...register("email")}
            invalid={!!errors.email}
            invalidText="Email is required"
          />
          <TextInput
            id="password"
            labelText="Password"
            type="password"
            placeholder="Password"
            {...register("password")}
            invalid={!!errors.password}
            invalidText="Password is required"
          />

          <Stack className="flex items-center gap-5 text-sm text-blue-500">
            <Link href="/auth/forgot-password">Forgot password?</Link>
            <Link href="/help">Need Help? Contact Support</Link>
          </Stack>

          <Stack className="flex items-center">
            <Button kind="ghost">Sign Up</Button>
            <Button type="submit" kind="primary" className="bg-blue-600">
              Login
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Stack>
  );
}
