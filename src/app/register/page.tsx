// app/register-patient/page.tsx

import { Suspense } from "react";
import { RegisterForm } from "../_components/login/register/register-form";

// Um componente interno para ler os searchParams de forma segura
function RegisterPageContent({
  searchParams,
}: {
  searchParams: { userId?: string; name?: string };
}) {
  const userId = searchParams?.userId;
  const name = searchParams?.name;

  // É importante ter uma validação
  if (!userId || !name) {
    return (
      <div>
        <h2>Dados de registro inválidos.</h2>
        <p>Por favor, volte e verifique seu telefone novamente.</p>
      </div>
    );
  }

  // Aqui passamos os dados para o formulário
  return <RegisterForm user={{ id: userId, name: name }} />;
}

// O componente de página principal
export default function Page({
  searchParams,
}: {
  searchParams: { userId?: string; name?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Usamos Suspense para o caso de a leitura dos params demorar */}
      <Suspense fallback={<div>Carregando...</div>}>
        <RegisterPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
