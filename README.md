# Table of Contents

1. [Hunt Guide](#hunt-guide)
    1. [Creating the hunt](#creating-the-hunt)
        1. [Copying this repository](#copying-this-repository)
        3. [Adding puzzles](#adding-puzzles)
        4. [Hunt structure](#hunt-structure)
        5. [Final Checks](#final-checks)
    2. [Administering the hunt](#administering-the-hunt)
        1. [Navigation](#navigation)
        2. [Hinting and Errata](#hinting-and-errata)
        3. [Team management](#team-management)

2. [Developer's Guide](#developers-guide)
    1. [Quick Start](#quick-start)
    3. [Quick Links](#quick-links)
    2. [Overview](#overview)
    4. [Roadmap](#roadmap)
        2. [By Puzzlethon](#by-puzzlethon)
        3. [By Brown Puzzlehunt](#by-brown-puzzlehunt)
    5. [Some design decisions](#some-design-decisions)
        1. [Architecture](#architecture)
        2. [Different ways to communicate between client and server](#different-ways-to-communicate-between-client-and-server)
        3. [Server Components vs Client Components](#server-components-vs-client-components)

# Hunt Guide
## Creating the hunt
### Copying this repository
I recommend duplicating this repository for each hunt. 

1. Create a bare clone of this repostiory.
    ```
    git clone --bare https://github.com/qiaochloe/bph-site.git
    ```
2. Create a new repository on GitHub. You will get an URL for this repository.
3. Mirror-push to the new repository.
    ```
    cd bph-site.git
    git push --mirror https://github.com/Brown-Puzzle-Club/NEW_REPOSITORY.git
    ```
4. Remove the temporary repository.
    ```
    cd ..
    rm -rf bph-site.git
    ```
5. Clone the new repository to your local machine.
    ```
    git clone https://github.com/Brown-Puzzle-Club/NEW_REPOSITORY.git
    ```

6. Add the original repository as a remote branch `public`.
    ```
    git remote add public https://github.com/qiaochloe/bph-site.git
    ```

7. To get changes from the original repository, run
    ```
    git fetch public
    ```

8. To merge changes from the original repository, run
    ```
    git merge public/main
    ```

There is more information on the [GitHub docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository).

### Adding puzzles
1. Get the puzzle name, the slug, and the answer. This is up to the puzzle-writer. The slug must be unique.

    ```
    Puzzle name: "Sudoku #51"
    Slug: "sudoku51"
    Answer: "IMMEDIATE"
    ```

2. Update the puzzle table on Drizzle.
    
    To get to Drizzle, run `pnpm run db:push` and
    go to `https://local.drizzle.studio/`. The `name` column is the name, the `id` column is the slug, and the `answer` column is the answer.

    ```
    {
        id: "sudoku51",
        name: "Sudoku #51",
        answer: "IMMEDIATE"
    }
    ```

3. There are several steps to creating a puzzle page with varying levels of customizability.
    1. After adding the puzzle to the puzzle table, you can automatically access the default look of the puzzle. This is useful for checking that the database is working correctly.
    
        Eg. `https://localhost:3000/puzzle/sudoku51`

    2. To customize the puzzle page, create a folder in `src/app/(hunt)/puzzle/`. The folder must be named after the puzzle slug. Copy the contents of the `src/app/(hunt)/puzzle/example` folder. **Hard-code the puzzle id, the puzzle body, and the solution body inside of data.tsx.** The puzzle, hint, and solution pages for this particular puzzle will be automatically updated. You can view them at:

        1. Puzzle: `https://localhost:3000/puzzle/sudoku51/`
        2. Solution: `https://localhost:3000/puzzle/sudoku51/solution`
        3. Hint: `https://localhost:3000/puzzle/sudoku51/hint`

    3. To completely customize the puzzle page, throw out the default components and edit `page.tsx` directly.

### Hunt Structure
All of the customizable features of the hunt structure is in `hunt.config.ts`. To change how puzzles are unlocked, edit `getNextPuzzleMap` in `hunt.config.ts`. To change how many hints a team gets, edit `getTotalHints`.

### Final Checks
Make sure that `hint.config.ts` is correct. 

Before registration starts,
1. Set `REGISTRATION_START_TIME` and `REGISTRATION_END_TIME`
2. Set `HUNT_START_TIME` and `HUNT_END_TIME`

Before the hunt starts,
5. Set `NUMBER_OF_GUESSES_PER_PUZZLE`
6. Set `INITIAL_PUZZLES`, `getNextPuzzleMap`, and `checkFinishHunt`
7. Set `getTotalHints`
3. Remove the dynamic puzzles in `src/app/(hunt)/puzzle/[slug]`
4. Remove the example puzzle in `src/app/(hunt)/puzzle/example`.

## Administering the Hunt
### Navigation
For admins, there is an `admin` section and a `hunt` section with different navbars. You can navigate using the navbar or the command palette (`Cmd-K` or `Ctrl-K`). This works reliably on Chrome, but you might need to refresh on Safari or other browsers. 

### Hinting and Errata
This can be managed in the `admin` section under `admin/hints` and `admin/errata`.

### Team Management
Team password resets can be made in `teams/username`. Please don't change them directly in the Drizzle database. It won't work correctly because passwords need to be hashed.

# Developers' Guide
## Quick start
1. Install [pnpm](https://pnpm.io/) from online or using Homebrew and clone this repo.
2. Copy the `.env.example` file to `.env` and fill in the values. You will only need to sign up for **Vercel Postgres** and integrate it with Drizzle to develop locally. 
3. Run `pnpm install` to install the dependencies.
4. Run `pnpm run dev` to start the development server.
5. Run `pnpm run db:studio` in a separate shell to open Drizzle Studio in your browser.
6. Run `pnpm run db:push` in a separate shell to push the schema in `src/server/db/schema.ts` to the database.

## Quick Links
Make sure to check that you are reading documentation for Next.js with the App Router, not the Pages Router.

Auth.js is formerly known as NextAuth.js. 
Most documentation out there is still for v4, so check that you are reading documentation for v5.

- [Next.js](https://nextjs.org/docs/app) with the App Router
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Drizzle](https://orm.drizzle.team/docs/overview)
- [Auth.js](https://authjs.dev/) v5
- [Vercel Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [Shadcn](https://ui.shadcn.com/docs)

## Overview
This project is built using **Next.js v14** using the App Router (not the Pages Router). The frontend is in the `src/app` folder, and the backend is in the `src/server` folder.

We use Vercel **Postgres** as the database and **Drizzle** as the ORM. All of the code for the database is in the `src/server/db` folder.

Most of the client-to-server communication is currently handled by Vercel Server Actions. 
Server Actions allow us to execute database queries or API calls inside of a React component without needing to explicitly define an API route.
Note that Server Actions can only be defined in Server Components marked with the `use server` directive.
To make them available in Client Components marked with the `use client` directive, they must be imported or passed as a prop.
Server Actions are generally located in `actions.tsx` files distributed throughout `src/app`.

Authentication, authorization, and session management is handled by **Auth.js**.
We only support username/password authentication using the `Credentials` provider.
Sessions are stored in Json Web Tokens (JWTs) instead of database sessions.
The setup is in the `src/server/auth` folder.

Finally, on the frontend, we are using **Shadcn UI** components with the **Tailwind CSS** framework. Components are in the `src/components/ui` folder.

# Roadmap
## By Puzzlethon
1. In terms of hunt logistics:
    1. Registration opens
    2. Registration closes
    3. When the hunt starts, puzzles drop
    4. When the hunt ends, guesses are frozen

2. Teams can:
    1. Register (`src/app/register`)
    2. Login (`src/app/login`)
    3. Make guesses (`src/app/puzzle/components/GuessForm.tsx`)
    4. See previous guesses (`src/app/puzzle/components/PreviousGuessTable.tsx`)
    5. Request hints (`src/app/puzzle/components/HintForm.tsx`)
    6. See previous hints (`src/app/puzzle/components/PreviousHintTable.tsx`)
    7. See the leaderboard (`src/app/leaderboard`)

3. Admins can:
    1. See all teams (`src/app/admin/teams`)
    2. See all guesses (`src/app/admin/guesses`)
    3. See all requests for hints (`src/app/admin/hints`)
    4. Give teams hints (`src/app/admin/hints`)

## By Brown Puzzlehunt
- [ ] Discord bot
- [ ] Sync hint claiming between team members using streams
- [ ] Sync guesses between team members using streams

# Some design decisions
## Architecture
DNS -> Cloudflare -> Digital Ocean -> Reverse proxy -> Digital Ocean
                                                    -> Vercel

The DNS can also do reverse proxying. We can also reduce cost by $20/month by using a static site.


## Different ways to communicate between client and server
### APIs, including server actions
Application Programming Interface (API) routes provide non-persistent, synchronous, bidirectional communication between the client and the server. It is synchronous because the client sends a request to the server, waits for a response, and closes the connection. There is latency from opening the connection. 

There are two types of API architectures: REST and RPC. RPC APIs allow clients to call remote functions in the server as if they were local functions. REST APIs allow clients to perform specific, predefined actions using HTTP verbs (GET, POST, PUT).

**Server actions** uses the RPC architecture. Whenever you add `use server` to a function or file, it marks it as available to the client. The client will get a URL string to that function, which they can use to send a request to the server using RPC. You never see this URL string, but that's how it works under the hood. The most significant benefit of using server actions is that you don't need to create an API route. This is good enough for our use case, which is just handling database queries and mutations.

Some caveats: server actions only work in server components, so you will have to import them or pass them as props to client components if you want to add interactivity. Server actions only support POST requests, which is primarily used for data mutations. They can be used for data-fetching, but that's not the best choice. Instead, do that directly in the server component.

Note that there might be some old code that uses the `tRPC` library. That can be safely ignored; we're not using `tRPC` because we don't need the extra features it provides.

### Websockets
Websockets provide persistent, asynchronous, bidirectional communication between the client and server. It is asynchronous because the client can send messages to the server at any time, and the server can send messages to the client at any time. This is useful for real-time applications like chat apps, multiplayer games, and collaborative tools.

It's nice to have websockets to sync data between different team members. For example, if one person makes a guess, we want to update the page of everyone else on the team immediately. **But historically, websockets have been the root of all of our problems.** It probably comes down to how Django handles websockets, but we're going to try to avoid them entirely.

If we really want websockets, we need to either host it on another server, use a websocket provider, or use a real-time database. Vercel does not support websockets because it is serverless.

### Server-Side Events (SSE) or Streaming 
Streaming is a persistent, asynchronous, unidirectional technique for sending data to the client in real-time. This is useful for real-time applications like chat apps, multiplayer games, and collaborative tools.

This is probably the best way for us to sync guesses between different team members. More information about how Vercel handles SSEs [here](https://vercel.com/blog/an-introduction-to-streaming-on-the-web). This is not high on the priority list, but it would be nice to have.

## Server Components vs Client Components
Server components handle static data fetching and rendering. For example, the leaderboard page is a server component. Client components handle user interactions such as form submissions and client-side events. The guess form is a client component. Note that these can be combined together, as in the puzzle page.