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
export const updateTeamInfoFormSchema = z.object({
  displayName: z
    .string()
    .min(1, { message: "Display name is required" })
    .max(50, { message: "Display name must be at most 50 characters long" }),
});
type TeamInfoFormProps = { teamId: string };

export function TeamInfoForm({ teamId }: TeamInfoFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Prefetch the home page
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const form = useForm<z.infer<typeof updateTeamInfoFormSchema>>({
    resolver: zodResolver(updateTeamInfoFormSchema),
    defaultValues: {
      displayName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateTeamInfoFormSchema>) => {
    const result = await updateTeam(teamId, {
      displayName: data.displayName,
    });

    if (result.error) {
      setError(result.error);
    } else {
      toast({
        title: "Update successful",
        description:
          "Your display name has successfully been changed to " +
          data.displayName +
          ".",
      });
      setError(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                This name will be displayed on the leaderboard.
              </FormDescription>
              <FormMessage> {error} </FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit">Update display name</Button>
      </form>
    </Form>
  );
}
