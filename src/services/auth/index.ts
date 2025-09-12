import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getPatientByEmail } from "@/server/sheet-data/get-patient-by-email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth",
    signOut: "/auth",
    error: "/auth",
  },
  providers: [
    Credentials({
      credentials: {
        loginType: { label: "Tipo de Login", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        // O campo 'name' não é mais usado para login do paciente, mas pode ser mantido para não quebrar outros fluxos se houver
      },
      async authorize(credentials) {
        // LÓGICA DE LOGIN DO ADMIN (NUTRI)
        if (credentials.loginType === "admin") {
          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error("Por favor, forneça e-mail e senha.");
          }

          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (email === adminEmail && password === adminPassword) {
            return {
              id: "admin-user",
              name: "Nutricionista",
              email: adminEmail,
              role: "admin",
            };
          } else {
            throw new Error("Credenciais de administrador inválidas.");
          }
        } // --- LÓGICA DE LOGIN DO PACIENTE ATUALIZADA ---

        if (credentials.loginType === "patient") {
          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error("Por favor, forneça e-mail e senha.");
          } // 1. Busca o paciente pelo e-mail na sua planilha

          const patient = await getPatientByEmail(email as string); // 2. Verifica se o paciente foi encontrado e se ele já tem uma senha registrada

          if (!patient || !patient.password) {
            throw new Error(
              "Credenciais inválidas ou cadastro não finalizado.",
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            password as string,
            patient.password,
          );

          if (isPasswordCorrect) {
            // SUCESSO: Retorna o objeto completo do paciente
            return {
              id: patient.userId,
              name: patient.name,
              email: patient.email,
              calories: patient.caloriesTarget,
              protein: patient.proteinTarget,
              role: "patient",
            };
          } else {
            // FALHA: Senha incorreta
            throw new Error("E-mail ou senha incorretos.");
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;

        if (user.role === "patient") {
          token.calories = user.calories;
          token.protein = user.protein;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;

        if (token.role === "patient") {
          session.user.calories = token.calories as string;
          session.user.protein = token.protein as string;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  cookies: {
    sessionToken: {
      name: process.env.SESSION_COOKIE_NAME || "authenticationjs.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
  },
  secret: process.env.AUTH_SECRET,
});
