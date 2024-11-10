"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { login, logout } from "./actions";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function LoginForm() {
  const session = useSession();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    const result = await login(data.username, data.password);
    if (result.error !== null) {
      setError(result.error);
    } else {
      if (session.data?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
        router.refresh();
      }
      setError(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-64 space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="jcarberr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage>{error}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit">Log In</Button>
        <div className="py-2 text-sm">
          New to the hunt?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}

export function LogoutForm() {
  return <Button onClick={() => logout()}>Logout</Button>;
}
