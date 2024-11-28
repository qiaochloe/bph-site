"use client";

import { useState } from "react";
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
      .max(100, { message: "Answer will not be longer than 100 characters" }),
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
    mode: "onSubmit",
    defaultValues: {
      guess: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    const result = await insertGuess(puzzleId, data.guess);
    if (result && result.error) {
      setError(result.error);
    }
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
                <Input
                  {...field}
                  onChange={(e) => {
                    form.setValue("guess", e.target.value, {
                      shouldValidate: false,
                    });
                    setError(null);
                  }}
                  className="bg-white text-black"
                />
              </FormControl>
              <FormDescription className="">
                {numberOfGuessesLeft}{" "}
                {numberOfGuessesLeft === 1 ? "guess" : "guesses"} left
              </FormDescription>
              <FormMessage>{error}</FormMessage>
            </FormItem>
          )}
        />
        <Button className="hover:bg-otherblue" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
