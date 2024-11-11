import { auth } from "@/auth";
import { db } from "@/db/index";
import FeedbackForm from "./FeedbackForm";

export default async function Home() {
  const session = await auth();

  const feedbackList = (await db.query.feedback.findMany()).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  return (
    <div className="mx-auto flex max-w-4xl grow flex-col">
      <h1 className="mb-2">Feedback</h1>
      <FeedbackForm feedbackList={feedbackList} />
    </div>
  );
}
