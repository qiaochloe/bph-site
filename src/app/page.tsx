import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
export const dynamic = "force-dynamic";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">Hello!</main>
  );
}
