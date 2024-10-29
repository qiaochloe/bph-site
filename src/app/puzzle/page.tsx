"use server";
import { HUNT_START_TIME } from "@/hunt.config";
import Link from "next/link";
import { db } from "@/db/index";

// NOTE: eventually, we probably want to create a layout for puzzle pages

// TODO: should puzzles page be available to non-logged in users?
export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p>This is the puzzle page.</p>
      {new Date() < HUNT_START_TIME ? (
        <p>The hunt has not started yet.</p>
      ) : (
        <>
          <p>Available puzzles:</p>
          <ul>
            {(
              await db.query.puzzles.findMany({
                columns: {
                  id: true,
                  name: true,
                },
              })
            )
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((puzzle) => (
                <li key={puzzle.id}>
                  <Link className="hover:underline" href={`/puzzle/${puzzle.id}`}>{puzzle.name}</Link>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}
