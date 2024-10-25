"use client";

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
  FormMessage,
} from "@/components/ui/form";

import { insertGuess } from "../actions";

const formSchema = z.object({
  guess: z
    .string()
    .min(1, { message: "Guess cannot be empty" })
    .max(50, { message: "Answer will not be longer than 50 characters" }),
});

type FormProps = {
  puzzleId: string;
};

export function GuessForm({ puzzleId }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guess: "",
    },
  });

  // #GoodFirstIssue
  // TODO: automatically change the answer to UPPERCASE ALPHABETIC
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await insertGuess(puzzleId, data.guess);
    form.reset();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="guess"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Guess" {...field} />
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
