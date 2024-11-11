import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { formatTime } from "~/lib/utils";
import { feedback } from "~/server/db/schema";

export default function FeedbackDialog({
    feedbackList,
}: {
    feedbackList: (typeof feedback.$inferSelect)[];
}) {
    if (feedbackList.length > 0) {
        return (
            <Alert className="mb-6 mt-2 bg-slate-100">
                {feedbackList.map((e, index) => (
                    <AlertDescription key={e.id} className="overflow-hidden break-words">
                        {index != 0 && <br />}
                        <p className="whitespace-normal">
                            <strong>Feedback {formatTime(e.timestamp)}</strong>:{" "}
                            {e.description}
                        </p>
                    </AlertDescription>
                ))}
            </Alert>
        );
    }

    return;
}
