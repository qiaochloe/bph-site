// import { NextApiRequest, NextApiResponse } from "next";
// import { db } from "~/server/db";
// import { guesses } from "~/server/db/schema";
//
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { puzzleId, guess, teamId } = body;
//
//     if (!puzzleId || !guess) {
//       return new Response("Name and description are required", {
//         status: 400,
//       });
//     }
//     const result = await db.insert(guesses).values({
//         puzzleId: puzzleId,
//         guess: guess,
//         teamId: teamId,
//       });
//
//     return new Response("Cool bro", {
//       status: 200,
//     });
//   } catch (e) {
//     return new Response("Sorry", { status: 500 });
//   }
// }
