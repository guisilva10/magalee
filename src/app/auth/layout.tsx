// app/(auth)/layout.tsx

import { auth } from "@/services/auth";
import { PropsWithChildren } from "react";
import { redirect } from "next/navigation"; // Importe o redirect
import { getUserFromSheet } from "@/server/sheet-data/get-user-from-db";
import { RegisterForm } from "../_components/login/register/register-form";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth();

  // Se não houver sessão, o usuário precisa fazer login (provavelmente o children é a tela de login)
  if (!session?.user?.id) {
    // Se não há sessão, o comportamento padrão é mostrar a página de login.
    // O children já deve ser a página de login, então apenas renderizamos.
    return <div>{children}</div>;
  }

  // O user.id da sessão deve ser o "numerodousuario@s.whatsapp.net"
  const userId = session.user.id;

  // Busca os dados do usuário na planilha do Google Sheets
  const sheetUser = await getUserFromSheet(userId);

  // CASO 1: Usuário autenticado mas NÃO está na planilha
  // Isso pode ser um estado inválido. Você pode redirecionar para uma página de erro ou logout.
  if (!sheetUser) {
    // Aqui você decide o que fazer. Pode ser mostrar uma página de "acesso negado".
    // Por segurança, redirecionar para o login novamente pode ser uma opção.
    // ou return <div>Acesso não autorizado. Seu número não está na lista.</div>;
    redirect("/login?error=unauthorized");
  }

  // CASO 2: Usuário está na planilha, mas NÃO tem email ou senha registrados.
  // Ele precisa completar o cadastro.
  if (sheetUser && (!sheetUser.email || !sheetUser.password)) {
    // Passamos o nome e o ID do usuário para o formulário de registro se necessário
    return (
      <RegisterForm user={{ name: sheetUser.name, id: sheetUser.userId }} />
    );
  }

  // CASO 3: Usuário está na planilha E JÁ TEM email e senha.
  // Ele pode prosseguir para a tela de login padrão (children).
  return <div>{children}</div>;
}
