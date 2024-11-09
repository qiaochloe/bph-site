"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HintTable } from "../../../hints/components/hint-table/HintTable";
import PreviousGuessTable from "~/app/(hunt)/puzzle/components/PreviousGuessTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { puzzles, guesses, teams } from "@/db/schema";
import { columns } from "../../../hints/components/hint-table/Columns";
import { HintWithRelations } from "../../../hints/components/hint-table/Columns";

export const puzzleInfoSchema = z.object({
  puzzleId: z.string().min(1, { message: "Puzzle is required" }),
});

export default function PuzzleInfoBox({
  team,
  puzzleList,
  guessList,
  hintList,
}: {
  team: typeof teams.$inferSelect;
  puzzleList: (typeof puzzles.$inferSelect)[];
  guessList: (typeof guesses.$inferSelect)[];
  hintList: HintWithRelations[];
}) {
  const [filteredHintList, setHintList] = useState<HintWithRelations[]>([]);
  const [filteredGuessList, setGuessList] = useState<
    (typeof guesses.$inferSelect)[]
  >([]);

  const form = useForm<z.infer<typeof puzzleInfoSchema>>({
    resolver: zodResolver(puzzleInfoSchema),
    defaultValues: {
      puzzleId: "",
    },
  });

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="flex flex-col items-center py-2">
          <FormField
            control={form.control}
            name="puzzleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puzzle</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(e) => {
                      field.onChange(e);
                      setHintList(
                        hintList.filter((hint) => hint.puzzleId === e),
                      );
                      setGuessList(
                        guessList.filter((guess) => guess.puzzleId === e),
                      );
                    }}
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
        </form>
      </Form>
      <div className="flex w-full flex-col items-center">
        <Tabs
          defaultValue="guesses"
          className="w-2/3 rounded-md bg-zinc-100 p-4"
        >
          <TabsList>
            <TabsTrigger value="guesses">
              Guesses ({filteredGuessList.length})
            </TabsTrigger>
            <TabsTrigger value="hints">
              Hint Requests ({filteredHintList.length})
            </TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>
          <TabsContent value="guesses">
            <div className="p-4">
              {filteredGuessList.length ? (
                <PreviousGuessTable previousGuesses={filteredGuessList} />
              ) : (
                <p className="w-full">No guesses yet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="hints">
            <div className="p-4">
              <HintTable columns={columns} data={filteredHintList} />
            </div>
          </TabsContent>
          <TabsContent value="additional">
            <div className="p-4">
              <p>
                <strong>Team ID: </strong>
                {team.id}
              </p>
              <p>
                <strong>Login / Username: </strong>
                {team.username}
              </p>
              <p>
                <strong>Role: </strong>
                {team.role}
              </p>
              <p>
                <strong>Interaction Mode: </strong>
                {team.interactionMode}
              </p>
              <p>
                <strong>Creation Time: </strong>
                {team.createTime?.toLocaleString()}
              </p>
              <p>
                <strong>Start Time: </strong>
                {team.startTime?.toLocaleString()}
              </p>
              <p>
                <strong>Finish Time: </strong>
                {team.finishTime?.toLocaleString()}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
