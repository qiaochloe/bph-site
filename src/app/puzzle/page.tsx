import { api } from "~/trpc/server";
import { auth } from "@/auth"
import { GuessForm } from "~/components/puzzles/GuessForm";


export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="p-4">Puzzle!</h1>
      <GuessForm puzzleId="puzzle-1" />
    </main>
  )
}