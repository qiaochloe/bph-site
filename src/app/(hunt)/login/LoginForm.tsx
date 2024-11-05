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

export const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function LoginForm() {
  // It might be more idiomatic to use the useFormState hook here
  // And in other places where we have a form
  // #BadFirstIssue
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
    if (result.error) {
      setError(result.error);
    } else {
      // TODO: would be nice if we can update the page using hooks rather than refreshing
      router.push("/admin");
      router.refresh();
      setError(null);
    }
  };

  // TODO: size of the form changes when the error message is shown
  // #GoodFirstIssue
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
