import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth/auth";
import { db } from "@/db/index";
import { guesses, hints } from "@/db/schema";
import { and, eq } from "drizzle-orm";

import Toast from "../components/hint-page/Toast";
import HintStatusBox from "../components/hint-page/HintStatusBox";
import PreviousHintTable from "../../../../(hunt)/puzzle/components/PreviousHintTable";
import PreviousGuessTable from "~/app/(hunt)/puzzle/components/PreviousGuessTable";
import { RequestBox } from "../components/hint-page/RequestBox";
import { ResponseBox } from "../components/hint-page/ResponseBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormattedTime } from "~/lib/time";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: number }>;
}) {
  // Authentication
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Check if slug is a valid number
  const { slug } = await params;
  const hintId = Number(slug);
  if (isNaN(hintId)) {
    return (
      <Toast
        title={"Invalid path"}
        description={`${slug} is not a valid hint ID.`}
      />
    );
  }

  const hint = await db.query.hints.findFirst({
    where: eq(hints.id, hintId),
    with: {
      team: { columns: { displayName: true, username: true } },
      claimer: { columns: { id: true, displayName: true } },
      puzzle: { columns: { name: true } },
    },
  });

  if (!hint) {
    return (
      <Toast
        title={"Hint not found"}
        description={`No hint with ID ${slug} was found.`}
      />
    );
  }

  const previousGuesses = await db.query.guesses.findMany({
    where: and(
      eq(guesses.teamId, hint.teamId),
      eq(guesses.puzzleId, hint.puzzleId),
    ),
  });

  const previousHints = (
    await db.query.hints.findMany({
      where: and(
        eq(hints.teamId, hint.teamId),
        eq(hints.puzzleId, hint.puzzleId),
      ),
      columns: { id: true, request: true, response: true },
      with: {
        followUps: {
          columns: { id: true, message: true, userId: true },
        },
      },
    })
  )
    // Check whether the user can edit the hint
    .map((hint) => ({
      ...hint,
      followUps: hint.followUps.map((followUp) => ({
        id: followUp.id,
        message: followUp.message,
        canEdit: followUp.userId === session?.user?.id,
      })),
    }));

  return (
    <div className="flex w-2/3 min-w-36 grow flex-col">
      <div className="flex flex-col items-center">
        <h1>Answer a Hint</h1>
        <HintStatusBox
          hintId={hint.id}
          claimer={hint.claimer}
          status={hint.status}
          userId={session.user.id}
        />
      </div>

      <div className="flex flex-col items-center">
        <Tabs
          defaultValue="response"
          className="w-2/3 overflow-auto rounded-md bg-zinc-100 p-4"
        >
          <TabsList>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="guesses">
              Guesses ({previousGuesses.length})
            </TabsTrigger>
            <TabsTrigger value="hints">
              History ({previousHints.length})
            </TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>
          <TabsContent value="response">
            <div className="bg-zinc-100 p-4 text-zinc-700">
              <p>
                <strong>From: </strong>
                <Link
                  href={`/admin/teams/${hint.team.username}`}
                  className="text-blue-600 hover:underline"
                >
                  {hint.team.displayName}
                </Link>
              </p>
              <p>
                <strong>For:</strong>{" "}
                <Link
                  href={`/puzzle/${hint.puzzleId}`}
                  className="text-blue-600 hover:underline"
                >
                  {hint.puzzle.name}
                </Link>
              </p>
              <RequestBox hint={hint} />
              {(hint.response ||
                (hint.claimer && hint.claimer.id === session.user.id)) && (
                <ResponseBox hint={hint} />
              )}
            </div>
          </TabsContent>
          <TabsContent value="guesses">
            <div className="p-4">
              <PreviousGuessTable previousGuesses={previousGuesses} />
            </div>
          </TabsContent>
          <TabsContent value="hints">
            <div className="p-4">
              <PreviousHintTable previousHints={previousHints} />
            </div>
          </TabsContent>
          <TabsContent value="additional">
            <div className="p-4">
              <p>
                <strong>Hint ID: </strong>
                {hint.id}
              </p>
              <p>
                <strong>Request Time: </strong>
                <FormattedTime time={hint.requestTime} />
              </p>
              <p>
                <strong>Claim Time: </strong>
                <FormattedTime time={hint.claimTime} />
              </p>
              <p>
                <strong>Response Time: </strong>
                <FormattedTime time={hint.responseTime} />
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
