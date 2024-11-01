"use client";
import { useActionState, useRef, useState } from "react";
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
import { useFormState } from "react-dom";

export const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const initialState = {
  error: "",
};

export function LoginForm() {
  // It might be more idiomatic to use the useFormState hook here
  // And in other places where we have a form
  // #BadFirstIssue
  const [state, formAction] = useFormState(login, initialState);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async () => {
    if (!state.error) {
      // TODO: would be nice if we can update the page using hooks rather than refreshing
      router.refresh();
    }
  };

  // TODO: size of the form changes when the error message is shown
  // #GoodFirstIssue
  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={(event) => {
          const formData = new FormData(formRef.current!);
          form.handleSubmit(() => {
            formAction(formData);
            onSubmit();
          })(event);
        }}
        className="space-y-8"
      >
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
              <FormMessage />
            </FormItem>
          )}
        />
        {state.error && <p className="text-red-500">{state.error}</p>}
        <Button type="submit">Log In</Button>
        <div className="text-sm">
          New to the hunt?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
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
