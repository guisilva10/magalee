import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryFromDescription(description: string): string {
  const lowerDesc = description.toLowerCase();

  // A ordem é importante para a prioridade.
  // Ex: "Café da manhã com ovos"
  if (
    /\b(café|pão|ovos|torrada|tapioca|iogurte|frutas|panqueca)\b/i.test(
      lowerDesc,
    )
  ) {
    return "Café da manhã";
  }
  // Ex: "Lanche com bolo"
  if (
    /\b(lanche|snack|bolo|biscoito|sanduíche|misto quente)\b/i.test(lowerDesc)
  ) {
    return "Lanche";
  }
  // Ex: "Jantar com sopa"
  if (/\b(jantar|janta|sopa)\b/i.test(lowerDesc)) {
    return "Jantar";
  }
  // Ex: "Almoço com arroz e frango" ou "Spaghetti Carbonara"
  if (
    /\b(almoço|prato feito|arroz|feijão|frango|carne|peixe|salada|bife|massa|carbonara|parmigiana|milanesa|grelhado)\b/i.test(
      lowerDesc,
    )
  ) {
    return "Almoço";
  }

  // Categoria padrão para refeições não identificadas.
  return "Outras Refeições";
}
