// actions/patient-auth.ts
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserFromSheet } from "./get-user-from-db";

export interface VerifyPhoneState {
  error?: string;
}

export async function verifyPatientPhone(
  prevState: VerifyPhoneState,
  formData: FormData,
): Promise<VerifyPhoneState> {
  const phone = formData.get("phone") as string;

  if (!phone) {
    return { error: "Por favor, insira um número de telefone." };
  }

  const normalizedPhone = phone.replace(/\D/g, "");
  const userId = `55${normalizedPhone}@s.whatsapp.net`; // Adapte se necessário

  const sheetUser = await getUserFromSheet(userId);

  if (!sheetUser) {
    return { error: "Este número de telefone não está cadastrado." };
  }

  // Crie um "passe de acesso" temporário para o paciente.
  (await cookies()).set("patient-verified", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 10, // 10 minutos para completar o login ou registro
  });

  if (sheetUser.email && sheetUser.password) {
    // Se já for registrado, mande para a tela de login, com a aba de paciente selecionada
    redirect("/auth?tab=patient");
  } else {
    // Se não for registrado, mande para a tela de registro de paciente
    const params = new URLSearchParams({
      userId: sheetUser.userId,
      name: sheetUser.name,
    });
    redirect(`/register?${params.toString()}`);
  }
}
