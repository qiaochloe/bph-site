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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateTeam } from "../actions";
import { roleEnum, interactionModeEnum } from "~/server/db/schema";
export const updateTeamInfoFormSchema = z
  .object({
    displayName: z
      .string()
      .min(1, { message: "Display name is required" })
      .max(50, { message: "Display name must be at most 50 characters long" })
      .or(z.literal("")),
    interactionMode: z.enum(interactionModeEnum.enumValues).optional(),
    role: z.enum(roleEnum.enumValues).optional(),
  })
  .refine(
    (input) => {
      if (input.role !== undefined || input.interactionMode !== undefined)
        return true;
      return input.displayName.length > 0;
    },
    {
      message: "At least one field is required",
      path: ["displayName"],
    },
  );
type TeamInfoFormProps = { teamId: string };

export function TeamInfoForm({ teamId }: TeamInfoFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // Prefetch the home page
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const form = useForm<z.infer<typeof updateTeamInfoFormSchema>>({
    resolver: zodResolver(updateTeamInfoFormSchema),
    defaultValues: {
      displayName: "",
      interactionMode: undefined,
      role: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof updateTeamInfoFormSchema>) => {
    const result = await updateTeam(teamId, {
      displayName: data.displayName,
      interactionMode: data.interactionMode,
      role: data.role,
    });

    if (result.error) {
      setError(result.error);
    } else {
      toast({
        title: "Update successful",
        description: "Your team info has successfully been updated.",
      });
      setError(null);
      router.refresh();
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
        {session?.user?.role === "admin" && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>This user should be a...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="user" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Regular user
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="admin" />
                      </FormControl>
                      <FormLabel className="font-normal">Admin</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Update team info</Button>
      </form>
    </Form>
  );
}
