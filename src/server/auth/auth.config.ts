import { type NextAuthConfig } from "next-auth";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authConfig = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.displayName = user.displayName;
        token.role = user.role;
        token.interactionMode = user.interactionMode;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          displayName: token.displayName as string,
          role: token.role as string,
          interactionMode: token.interactionMode as string,
        };
      }
      return session;
    },
  },
  // adapter: DrizzleAdapter(db),
  providers: [],
} satisfies NextAuthConfig;
