"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { puzzles } from "@/db/schema";
import { insertErratum } from "./actions";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "~/hooks/use-toast";

export const erratumFormSchema = z.object({
  puzzleId: z.string().min(1, { message: "Puzzle is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export default function ErratumForm({
  puzzleList,
}: {
  puzzleList: (typeof puzzles.$inferSelect)[];
}) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof erratumFormSchema>>({
    resolver: zodResolver(erratumFormSchema),
    defaultValues: {
      puzzleId: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof erratumFormSchema>) => {
    const result = await insertErratum(data.puzzleId, data.description);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      toast({
        description: "Erratum submitted for " + data.puzzleId + ".",
        action: (
          <Button
            onClick={() => (window.location.href = `/puzzle/${data.puzzleId}`)}
          >
            View
          </Button>
        ),
      });
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="puzzleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Puzzle</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {puzzleList?.map((puzzle) => (
                      <SelectItem key={puzzle.id} value={puzzle.id}>
                        {puzzle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="No response yet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
