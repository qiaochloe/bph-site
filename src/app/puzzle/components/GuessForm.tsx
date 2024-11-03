"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { insertGuess } from "../actions";

function sanitizeAnswer(answer: any) {
  return typeof answer === "string"
    ? answer.toUpperCase().replace(/[^A-Z]/g, "")
    : "";
}

const formSchema = z.object({
  guess: z.preprocess(
    sanitizeAnswer,
    z
      .string()
      .min(1, {
        message: "Guess must contain at least one alphabetical character",
      })
      .max(50, { message: "Answer will not be longer than 50 characters" }),
  ),
});

type FormProps = {
  puzzleId: string;
  numberOfGuessesLeft: number;
};

export default function GuessForm({
  puzzleId,
  numberOfGuessesLeft,
}: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guess: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await insertGuess(puzzleId, data.guess);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center space-x-4"
      >
        <FormField
          control={form.control}
          name="guess"
          render={({ field }) => (
            <FormItem className="w-2/3">
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                {numberOfGuessesLeft}{" "}
                {numberOfGuessesLeft === 1 ? "guess" : "guesses"} left
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="m-0">
          Submit
        </Button>
      </form>
    </Form>
  );
}
