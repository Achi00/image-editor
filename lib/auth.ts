import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/database";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/database/schema";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // First login: user contains database user
      if (user) {
        token.id = user.id;
      }
      // Subsequent logins: fetch user from DB using email
      else if (token.email) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email!));

        if (dbUser) token.id = dbUser[0].id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 30,
  },
  // debug: process.env.NODE_ENV === "development",
  debug: true,
  logger: {
    error: (error, ...metadata) => {
      console.error(error, ...metadata);
    },
    warn: (code) => {
      console.warn(code);
    },
    debug: (code, metadata) => {
      console.debug(code, metadata);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
