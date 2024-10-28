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
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { insertHint } from "../actions";

const formSchema = z.object({
  hintRequest: z.string(),
});

type FormProps = {
  puzzleId: string;
};

export function HintForm({ puzzleId }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hintRequest: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await insertHint(puzzleId, data.hintRequest);
    form.reset();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="hintRequest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hint Request</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Please be specific about what you need help with.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
