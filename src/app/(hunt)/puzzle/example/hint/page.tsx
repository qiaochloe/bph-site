import DefaultHintsPage from "../../components/DefaultHintsPage";
import { puzzleId } from "../data";

export default async function Page() {
  return <DefaultHintsPage puzzleId={puzzleId} />;
}
