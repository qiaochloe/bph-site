import DefaultSolutionPage from "../../components/DefaultSolutionPage";
import { puzzleId, SolutionBody } from "../data";

export default async function Page() {
  return (
    <DefaultSolutionPage puzzleId={puzzleId} solutionBody={SolutionBody()} />
  );
}
