import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extensão da Sessão para incluir propriedades customizadas
   */
  interface Session {
    user: {
      id: string;
      role: string; // 'admin' ou 'patient'
      calories?: string; // Opcional, pois o admin não terá
      protein?: string; // Opcional, pois o admin não terá
    } & DefaultSession["user"]; // Mantém as propriedades padrão como name, email, image
  }

  /**
   * Extensão do objeto User retornado pela função `authorize`
   */
  interface User {
    id: string;
    role: string;
    calories?: string;
    protein?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extensão do Token para incluir propriedades customizadas
   */
  interface JWT {
    id: string;
    role: string;
    calories?: string;
    protein?: string;
  }
}
