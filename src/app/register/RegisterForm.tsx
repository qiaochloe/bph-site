"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { interactionModeEnum } from "~/server/db/schema";

import { insertTeam } from "./actions";

export const registerFormSchema = z.object({
  // TODO: validate that username is unique and does not contain special characters
  username: z
    .string()
    .min(8, { message: "Username must be at least 8 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" }),
  displayName: z
    .string()
    .min(1, { message: "Display name is required" })
    .max(50, { message: "Display name must be at most 50 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" }),
  interactionMode: z.enum(interactionModeEnum.enumValues),
  // TODO: include additional team members
  // Check if we can make this consistent with the db schema automatically
});

type RegisterFormProps = {};

export function RegisterForm({}: RegisterFormProps) {
  const router = useRouter();

  // Prefetch the login page
  useEffect(() => {
    router.prefetch('/login'); 
  }, [router]);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      displayName: "",
      password: "",
      interactionMode: undefined,
    }
  });

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    try {
      await insertTeam(
        data.username,
        data.displayName,
        data.password,
        data.interactionMode,
      );
      // NOTE: this does not reset interactionMode for some reason
      // form.reset();

      // Redirect to login page
      // TODO: give user some sort of confirmation that they've been registered before redirecting
      router.push("/login");

    } catch (error) {
      console.error("Error inserting team:", error);
      // Do not reset the form if there is an error
    }
  };

  // TODO: size of the form changes when the error message is shown
  // See: LoginForm.tsx
  // TODO: might be nice to have people confirm their password twice
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="jcarberry" {...field} />
              </FormControl>
              <FormDescription>
                This is the private username your team will use when logging in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Josiah Carberry" {...field} />
              </FormControl>
              <FormDescription>
                This is the public display name. You can change at any time.
              </FormDescription>
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
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                You'll probably share this with your team.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interactionMode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>This team will be competing...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="in-person" />
                    </FormControl>
                    <FormLabel className="font-normal">In-person</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="remote" />
                    </FormControl>
                    <FormLabel className="font-normal">Remote</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
