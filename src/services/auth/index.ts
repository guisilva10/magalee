import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getPatientData } from "@/app/_lib/google-sheet"; // Sua função para buscar pacientes

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth",
    signOut: "/auth",
    error: "/auth",
  },
  providers: [
    Credentials({
      // Agora, esperamos mais campos possíveis do frontend
      credentials: {
        loginType: { label: "Tipo de Login", type: "text" },
        name: { label: "Nome", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // A função authorize agora decide o que fazer com base no 'loginType'

        // LÓGICA DE LOGIN DO ADMIN (NUTRI)
        if (credentials.loginType === "admin") {
          const { email, password } = credentials;

          // Valida se o email e senha foram enviados
          if (!email || !password) {
            throw new Error("Por favor, forneça e-mail e senha.");
          }

          // Pega as credenciais seguras do .env
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;

          // Compara as credenciais
          if (email === adminEmail && password === adminPassword) {
            // SUCESSO: Retorna o objeto do usuário admin.
            // É crucial adicionar um 'role' para diferenciar os tipos de usuário na aplicação.
            return {
              id: "admin-user",
              name: "Nutricionista",
              email: adminEmail,
              role: "admin", // <-- Papel de administrador
            };
          } else {
            // FALHA: Lança um erro que será enviado para o frontend.
            throw new Error("Credenciais de administrador inválidas.");
          }
        }

        // LÓGICA DE LOGIN DO PACIENTE
        if (credentials.loginType === "patient") {
          const { name } = credentials;

          if (!name) {
            throw new Error("O nome do paciente é obrigatório.");
          }

          // Usa sua função existente para buscar o paciente
          const patient = await getPatientData(name as string);

          if (patient) {
            // SUCESSO: Retorna o objeto do usuário paciente com o 'role'
            return {
              id: patient.userId,
              name: patient.name,
              calories: patient.calories,
              protein: patient.protein,
              role: "patient", // <-- Papel de paciente
            };
          } else {
            // FALHA: Paciente não encontrado
            throw new Error("Paciente não encontrado. Verifique seu nome.");
          }
        }

        // Se nenhum 'loginType' corresponder, retorna null
        return null;
      },
    }),
  ],
  callbacks: {
    // O callback JWT é chamado para criar ou atualizar o token.
    // Precisamos adicionar as novas informações (como 'role') ao token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Adiciona o 'role' ao token

        // Adiciona dados específicos do paciente apenas se o usuário for um paciente
        if (user.role === "patient") {
          token.calories = user.calories;
          token.protein = user.protein;
        }
      }
      return token;
    },

    // O callback da sessão é chamado para criar o objeto da sessão que será visto no cliente.
    // Pegamos os dados do token e passamos para a sessão.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Adiciona o 'role' à sessão

        // Adiciona dados específicos do paciente apenas se for o 'role' correto
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
