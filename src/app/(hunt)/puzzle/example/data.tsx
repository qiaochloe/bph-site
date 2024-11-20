/**
 * The puzzle ID is used to uniquely identify the puzzle in the database.
 * It should be equal to the name of the folder this file is currently under.
 * Feel free to make this creative, because the route to the puzzle will be
 * example.com/puzzle/puzzleId.
 */
export const puzzleId = "example";

/**
 * The `PuzzleBody` renders above the guess submission form. Put flavor text, images,
 * and interactive puzzle components here.
 */
export function PuzzleBody() : JSX.Element {
  return <div className="text-center">This is the body of the puzzle.</div>;
}

/**
 * The `SolutionBody` renders in the solution page. 
 * If there are no solutions available, return null.
 */
export function SolutionBody() : JSX.Element | null {
  return null;
  // return <div className="text-center">This is an example solution.</div>;
}
