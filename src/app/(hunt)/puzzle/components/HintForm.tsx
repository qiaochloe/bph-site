"use client";

import React from "react";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { insertHint } from "../actions";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const formSchema = z.object({
  hintRequest: z.string().min(1, {
    message: "Hint must contain at least one character",
  }),
});

type FormProps = {
  puzzleId: string;
  hintsRemaining: number;
  unansweredHint: { puzzleId: string; puzzleName: string } | null;
  hintRequest: string;
  setHintRequest: (hintRequest: string) => void;
  closeDialog: () => void;
};

function HintForm({
  puzzleId,
  hintsRemaining,
  unansweredHint,
  hintRequest,
  setHintRequest,
  closeDialog,
}: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hintRequest: hintRequest,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await insertHint(puzzleId, data.hintRequest);
    setHintRequest("");
    form.reset();
    closeDialog();
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
              <FormDescription>
                Please provide as much detail as possible to help us understand
                where you're at and where you're stuck! Specific clues, steps,
                and hypotheses are all helpful. If you're working with any
                spreadsheets, diagrams, or external resources, you can include
                links.
              </FormDescription>
              <FormControl>
                <AutosizeTextarea
                  maxHeight={500}
                  className="resize-none"
                  disabled={!!unansweredHint || hintsRemaining < 1}
                  {...field}
                  value={hintRequest}
                  onChange={(e) => {
                    setHintRequest(e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormDescription>
                {hintsRemaining === 0 ? (
                  "No hints remaining. "
                ) : (
                  <>
                    {hintsRemaining} {hintsRemaining === 1 ? "hint" : "hints"}{" "}
                    remaining.{" "}
                  </>
                )}
                {unansweredHint &&
                  (puzzleId === unansweredHint.puzzleId ? (
                    <>You have an outstanding hint on this puzzle.</>
                  ) : (
                    <>
                      You have an outstanding hint on the puzzle{" "}
                      <Link
                        href={`/puzzle/${unansweredHint.puzzleId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {unansweredHint.puzzleName}
                      </Link>
                      .
                    </>
                  ))}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!!unansweredHint || hintsRemaining < 1}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default function HintDialog({
  puzzleId,
  hintsRemaining,
  unansweredHint,
}: {
  puzzleId: string;
  hintsRemaining: number;
  unansweredHint: { puzzleId: string; puzzleName: string } | null;
}) {
  const [hintRequest, setHintRequest] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="z-90 fixed bottom-4 right-4">
          <p className="m-2">Request a hint</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-4 min-w-36">
          <HintForm
            puzzleId={puzzleId}
            hintsRemaining={hintsRemaining}
            unansweredHint={unansweredHint}
            hintRequest={hintRequest}
            setHintRequest={setHintRequest}
            closeDialog={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
