import DefaultPuzzlePage from "../components/DefaultPuzzlePage";
import { PuzzleBody } from "./data";
import { puzzleId } from "./data";

export default async function Page() {
  return <DefaultPuzzlePage puzzleId={puzzleId} puzzleBody={PuzzleBody()} />;
}
