import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { formatTime } from "~/lib/utils";
import { errata } from "~/server/db/schema";

export default function ErratumDialog({
  errataList,
}: {
  errataList: (typeof errata.$inferSelect)[];
}) {
  if (errataList.length > 0) {
    return (
        <Alert className="bg-slate-100"
        >
          <AlertTitle>Errata</AlertTitle>
          {errataList.map((e) => (
            <AlertDescription
              key={e.id}
              className="overflow-hidden break-words"
            >
              <br />
              <strong>{formatTime(e.timestamp)}</strong>:
              <p className="whitespace-normal">{e.description}</p>
            </AlertDescription>
          ))}
        </Alert>
    );
  }

  return;
}
