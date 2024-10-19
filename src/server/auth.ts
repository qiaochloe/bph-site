import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { type DefaultSession } from "next-auth";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { eq, and } from 'drizzle-orm'
import { db } from "~/server/db";
import { teams } from "~/server/db/schema";
import { object, string } from "zod"
import { compare } from "bcrypt";

export const signInSchema = object({
  name: string({ required_error: "Team name is required" })
    .min(1, "Team name is required"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
})

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    // user: {
    //   id: string;
    //   email: string;
    //   emailVerified: Date;
    //   name: string;
    //   image: any;
    // role: UserRole;
    // } // & DefaultSession["user"];
  }

  interface User {
    id?: string | undefined;
    name?: string | null | undefined;
    // image?: string | null | undefined;
    // emailVerified: Date;
    // email?: string | null | undefined;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const { auth, signIn, signOut, handlers } = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string
        };
      }
      return session;
    }
  },
  // adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      // These are the fields to be submitted
      credentials: {
        name: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.name || !credentials?.password) {
          return null;
        }

        const { name, password } = await signInSchema.parseAsync(credentials)

        // TODO: Add logic to salt and has password
        // const pwHash = saltAndHashPassword(credentials.password)

        // TODO: Make sure to check that the name is unique
        // Check if team exists in the database
        const user = await db.query.teams.findFirst({
          where: eq(teams.name, name)
        });

        if (user /* && (await compare(password, user.password)) */) {
          return {
            id: user.id,
            name: user.name,
          }
        }
        return null;
      }
    })
  ]
});