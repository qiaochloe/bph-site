import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { GuessForm } from "~/components/puzzles/GuessForm";


export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();
  void api.post.getLatest.prefetch();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="p-4">Puzzle!</h1>
      <GuessForm puzzleId={2} />
    </main>
  )
}