import { Patient } from "@/server/sheet-data/get-sheet-all-data";
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

interface PatientConsumption {
  calories: number; // Meta de calorias
  protein: number; // Meta de proteína
  consumedCaloriesToday: number;
  consumedProteinToday: number;
}

/**
 * Calcula o status nutricional de um paciente com base no consumo diário versus a meta.
 * @param patient O objeto do paciente com metas e consumo.
 * @returns 'green' se ambas as metas foram atingidas, 'red' se nenhuma foi, e 'yellow' caso contrário.
 */
export function getPatientStatus(patient: Patient): "green" | "yellow" | "red" {
  // Converte as metas de string para número para a comparação.
  const targetCalories = parseFloat(patient.caloriesTarget) || 0;
  const targetProtein = parseFloat(patient.proteinTarget) || 0; // Se a meta de calorias ou proteínas for 0, o paciente está fora da meta.

  if (targetCalories <= 0 || targetProtein <= 0) {
    return "red";
  }

  const caloriesOk = patient.consumedCaloriesToday >= targetCalories;
  const proteinOk = patient.consumedProteinToday >= targetProtein;

  if (caloriesOk && proteinOk) {
    return "green";
  }
  if (!caloriesOk && !proteinOk) {
    return "red";
  }
  return "yellow";
}
