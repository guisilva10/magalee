// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// A função getUrl pode ser movida para um lib para ser usada em outros lugares também
const getUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  return new URL(path, baseUrl).toString();
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get(
    process.env.SESSION_COOKIE_NAME || "authenticationjs.session-token",
  );
  const { pathname } = request.nextUrl;

  // --- LÓGICA EXISTENTE (Proteção de Dashboards) ---
  const isUserAuthenticated = !!token;

  // Se o usuário está logado e tenta acessar a página de autenticação
  if (isUserAuthenticated && pathname === "/auth") {
    // Você precisa de uma lógica para saber qual dashboard redirecionar.
    // Isso geralmente vem de um 'role' no token da sessão.
    // Por simplicidade, vamos assumir que o fluxo do paciente é o padrão.
    return NextResponse.redirect(new URL(getUrl("/dashboard")));
  }

  // Se o usuário não está logado e tenta acessar um dashboard
  if (
    !isUserAuthenticated &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin/dashboard"))
  ) {
    return NextResponse.redirect(new URL(getUrl("/auth")));
  }

  // --- NOVA LÓGICA (Proteção do Fluxo do Paciente) ---

  // Verificamos se o paciente passou pela verificação de telefone
  const hasVerifiedPatient = request.cookies.get("patient-verified");

  // Se alguém tentar acessar a página de registro de paciente SEM o "passe"
  if (pathname === "/register" && !hasVerifiedPatient) {
    // Forçamos ele a voltar para o início do fluxo
    return NextResponse.redirect(new URL(getUrl("/verify-number")));
  }

  // Se nenhuma regra de redirecionamento foi acionada, permite o acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Roteamos tudo, exceto arquivos estáticos e internos do Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
