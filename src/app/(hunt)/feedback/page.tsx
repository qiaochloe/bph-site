import { auth } from "@/auth";
import { db } from "@/db/index";
import FeedbackForm from "./FeedbackForm";
import { eq } from "drizzle-orm";
import { feedback } from "~/server/db/schema";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <h1 className="mb-2">Feedback</h1>
        <div>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>{" "}
          to submit feedback.
        </div>
      </div>
    );
  }

  const feedbackList = (
    await db.query.feedback.findMany({
      where: eq(feedback.teamId, session?.user?.id),
    })
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div className="mx-auto flex max-w-4xl grow flex-col">
      <h1 className="mb-2">Feedback</h1>
      <FeedbackForm feedbackList={feedbackList} />
    </div>
  );
}
