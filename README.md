# Table of Contents

1. [Quick Start](#quick-start)
3. [Quick Links](#quick-links)
2. [Overview](#overview)
4. [Roadmap](#roadmap)
   1. [Current Progress](#current-progress)
   2. [By Puzzlethon](#by-puzzlethon)
   3. [By Brown Puzzlehunt](#by-brown-puzzlehunt)
5. [Some design decisions](#some-design-decisions)
   1. [Architecture](#architecture)
   2. [Different ways to communicate between client and server](#different-ways-to-communicate-between-client-and-server)
   3. [Server Components vs Client Components](#server-components-vs-client-components)

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
