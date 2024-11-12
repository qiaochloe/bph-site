"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "~/hooks/use-toast";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateTeam } from "../actions";
export const passwordResetFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50, { message: "Password must be at most 50 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordResetForm = { teamId: string };

export function PasswordResetForm({ teamId }: PasswordResetForm) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Prefetch the home page
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const form = useForm<z.infer<typeof passwordResetFormSchema>>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof passwordResetFormSchema>) => {
    const result = await updateTeam(teamId, {
      password: data.password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      toast({
        title: "Password reset successfully",
        description: "Your password has been successfully reset.",
      });
      setError(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Don't forget this again.</FormDescription>
              <FormMessage>{error}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Reset password</Button>
      </form>
    </Form>
  );
}
