"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, TextInput } from "@primer/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { APP_NAME } from "../_lib/globals";
import { supabaseClient } from "../_lib/supabase";
import Shape from "./images/shape.svg";

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
    <div className="grid grid-cols-2 w-full h-full min-h-screen">
      <div className="overflow-hidden relative w-full h- hidden lg:flex">
        <Image src={Shape} alt="Shape" layout="fill" />
      </div>
      <form
        aria-label="Login Form"
        className="p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <div className="mobile-shape lg:hidden">
            <Image src={Shape} alt="Shape" width="100" height="100" />
          </div>

          <h3 className="text-xl">Welcome to {APP_NAME} Inventory Platform</h3>
          <p className="text-xs">
            Please log in to access your account and manage human resources
            efficiently.
          </p>

          <FormControl>
            <FormControl.Label>Email Address</FormControl.Label>
            <TextInput
              id={"email"}
              type="text"
              className="w-full"
              placeholder="Email Address"
              {...register("email")}
              validationStatus={errors.email && "error"}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <TextInput
              className="w-full"
              id={"password"}
              placeholder="Password"
              type="password"
              {...register("password")}
              validationStatus={errors.password && "error"}
            />
          </FormControl>

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
      </form>
    </div>
  );
}
