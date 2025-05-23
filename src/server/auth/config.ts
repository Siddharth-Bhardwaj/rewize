import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { type DefaultSession, type NextAuthConfig } from "next-auth";

import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { env } from "@/env";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  // cookies: {
  //   sessionToken: {
  //     name:
  //       env.NEXT_PUBLIC_NODE_ENV === "production"
  //         ? "__Secure-authjs.session-token"
  //         : "next-auth.session-token",
  //   },
  // },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user?.password || typeof user.password !== "string") {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    /**
     * ...add more providers here.
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        name: token.name,
        email: token.email,
        image: token.picture,
      },
    }),
    jwt: async ({ token, user, session, trigger }) => {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      if (trigger === "update" && session) {
        const sessionUser = (
          session as { user: { name: string; image: string | null } }
        ).user;

        if (sessionUser) {
          token.name = sessionUser.name;
          token.picture = sessionUser.image;
        }
      }

      return token;
    },
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      if (!auth && !pathname?.includes("/auth")) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      } else if (!!auth && pathname?.includes("/auth")) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
