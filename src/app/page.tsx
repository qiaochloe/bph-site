import { api } from "~/trpc/server";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">Hello!</main>
  );
}
