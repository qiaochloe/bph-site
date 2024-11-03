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
      <Alert className="mb-6 mt-2 bg-slate-100">
        {errataList.map((e, index) => (
          <AlertDescription key={e.id} className="overflow-hidden break-words">
            {index != 0 && <br />}
            <p className="whitespace-normal">
              <strong>Erratum {formatTime(e.timestamp)}</strong>:{" "}
              {e.description}
            </p>
          </AlertDescription>
        ))}
      </Alert>
    );
  }

  return;
}
