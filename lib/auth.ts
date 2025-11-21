// lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authConfig = {
  // Página de login personalizada
  pages: {
    signIn: "/es/login", // locale por defecto es "es"
  },

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        //  Aquí hacemos los chequeos con typeof para que TS sepa que son string
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const emailNorm = credentials.email.toLowerCase();
        const password = credentials.password;

        // Buscamos el usuario en la BD
        const user = await prisma.user.findUnique({
          where: { email: emailNorm },
        });

        if (!user) {
          return null;
        }

       
        // Aquí comparamos en plano porque en el registro estamos guardando la contraseña sin hash.
        // Para un proyecto real usaríamos bcrypt.compare.
        if (user.password !== password) {
          return null;
        }

        // Lo que devolvamos aquí irá al token JWT
        return {
          id: user.id,
          email: user.email,
          role: user.role, // "CUIDADOR" o "MAESTRO"
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Cuando el usuario hace login, metemos sus datos en el token
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      // Pasamos id y role a session.user
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

// Inicializamos NextAuth con esta config
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
