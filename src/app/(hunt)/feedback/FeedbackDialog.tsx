import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { formatTime } from "~/lib/utils";
import { feedback } from "~/server/db/schema";

export default function FeedbackDialog({
  feedbackList,
}: {
  feedbackList: { id: number; description: string; timestamp: Date }[];
}) {
  if (feedbackList.length > 0) {
    return (
      <Alert className="mt-7 bg-slate-100">
        {feedbackList.map((e, index) => (
          <AlertDescription key={e.id} className="overflow-hidden break-words">
            {index != 0 && <br />}
            <p className="whitespace-normal">
              <strong>{formatTime(e.timestamp)}</strong>: {e.description}
            </p>
          </AlertDescription>
        ))}
      </Alert>
    );
  }

  return;
}
