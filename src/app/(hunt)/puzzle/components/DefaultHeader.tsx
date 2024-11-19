import Link from "next/link";
import { canViewSolutions } from "~/hunt.config";

export default async function DefaultHeader({
  puzzleName,
  puzzleId,
}: {
  puzzleName: string;
  puzzleId: string;
}) {
  return (
    <div className="mb-4 w-2/3 min-w-36 flex-col items-center text-center">
      <h1>{puzzleName}</h1>
      <div className="space-x-2 text-sm">
        <Link
          href={`/puzzle/${puzzleId}`}
          className="text-blue-600 hover:underline"
        >
          Puzzle
        </Link>
        <span className="text-gray-500">|</span>
        <Link
          href={`/puzzle/${puzzleId}/hint`}
          className="text-blue-600 hover:underline"
        >
          Hint
        </Link>
        {(await canViewSolutions(puzzleId)) && (
          <>
            <span className="text-gray-500">|</span>
            <Link
              href={`/puzzle/${puzzleId}/solution`}
              className="text-blue-600 hover:underline"
            >
              Solution
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
