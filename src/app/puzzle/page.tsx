"use server"
import { HUNT_START_TIME } from "@/hunt.config"
import Link from "next/link"
import { db } from "@/db/index"

// TODO: should puzzles page be available to non-logged in users?
export default async function Home() {
    return (
        <main>
            <p>This is the puzzle page.</p>
            { new Date() < HUNT_START_TIME ? (
                <p>The hunt has not started yet.</p>
            ) : 
            <>
              <p>Available puzzles:</p>
              <ul>
                {(await db.query.puzzles.findMany({
                  columns: {
                    id: true,
                    name: true
                  }
                }))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((puzzle) => (
                  <li key={puzzle.id}>
                    <Link href={`/puzzle/${puzzle.id}`}>
                      {puzzle.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
            }
        </main>
    )
}