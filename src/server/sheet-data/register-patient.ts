"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { updateUserInSheet } from "./update-user-insheet";

// 1. Definir o schema de validação com Zod
const RegisterSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório."),
  name: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("Formato de e-mail inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export interface RegisterState {
  error?: string;
  success?: boolean;
}

export async function registerPatient(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // 2. Converter FormData para um objeto simples
  const rawFormData = Object.fromEntries(formData.entries());

  // 3. Validar os dados usando o schema do Zod
  const validatedFields = RegisterSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    // Retorna o primeiro erro encontrado
    return { error: validatedFields.error.message };
  }

  const { userId, email, password, name } = validatedFields.data;

  try {
    // 4. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o "salt rounds"

    // 5. Atualizar os dados na planilha do Google Sheets
    // A função updateUserInSheet deve encontrar a linha pelo userId
    // e atualizar as colunas de Email e Password.
    const updated = await updateUserInSheet({
      userId,
      email,
      password: hashedPassword,
    });

    if (!updated) {
      return {
        error: "Não foi possível completar o registro. Tente novamente.",
      };
    }
  } catch (error) {
    console.error("Erro no registro:", error);
    return { error: "Ocorreu um erro inesperado." };
  }

  // 6. Redirecionar para a página de login em caso de sucesso
  redirect("/auth?tab=patient&registered=true");
}
