"use client";

import { Button } from "@/app/_components/ui/button";
import { deleteCategory } from "@/server/sheet-data/get-category";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { DeleteCategoryAlert } from "./delete-category";
import { EditCategoryDialog } from "./edit-category";

interface MealItem {
  patientName: string;
  Calories: number;
}

interface CategoryData {
  categoryName: string;
  totalCalories: number;
  mealCount: number;
  meals: MealItem[];
}

export function MealCategoriesClient({ data }: { data: CategoryData[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Estado para o diálogo de edição
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
  const descriptions: { [key: string]: string } = {
    "Café da manhã": "Primeira refeição do dia",
    Almoço: "Refeição principal",
    Lanche: "Refeição leve entre as principais",
    Jantar: "Última refeição do dia",
    "Outras Refeições": "Refeições não classificadas",
  };

  const handleEditClick = (categoryName: string) => {
    setCategoryToEdit(categoryName);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    startTransition(async () => {
      await deleteCategory(categoryToDelete);
      setIsAlertOpen(false);
      setCategoryToDelete(null);
    });
  };

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto w-full">
        {/* Cabeçalho da Página */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Categorias Personalizadas
            </h1>
            <p className="text-gray-500">
              Gerencie as categorias de alimentos e refeições
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        {/* Condição para exibir mensagem quando não há dados */}
        {!data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Nenhuma Refeição Encontrada
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Ainda não há dados de refeições na sua planilha para exibir as
              categorias.
            </p>
          </div>
        ) : (
          // Renderiza a lista de categorias se houver dados
          <div className="space-y-4">
            {data.map((category) => {
              // Cálculos feitos no lado do cliente com base nos dados recebidos
              const averageCalories =
                category.mealCount > 0
                  ? Math.round(category.totalCalories / category.mealCount)
                  : 0;
              // NOTA: O dado "Compliance" é simulado para fins de design,
              // pois não existe na planilha.
              const compliance = Math.floor(Math.random() * (98 - 75 + 1)) + 75;

              return (
                <div
                  key={category.categoryName}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Informações da Categoria */}
                  <div className="min-w-[250px] flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {category.categoryName}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Média: {averageCalories.toLocaleString("pt-BR")} kcal •
                      Compliance: {compliance}%
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {descriptions[category.categoryName] ||
                        "Descrição da categoria"}
                    </p>
                  </div>

                  {/* Ações e Status */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        compliance > 85
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {compliance}% aderência
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="..."
                      onClick={() => handleEditClick(category.categoryName)}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="..."
                      onClick={() => handleDeleteClick(category.categoryName)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <DeleteCategoryAlert
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        categoryName={categoryToDelete}
        onConfirm={confirmDelete}
        isPending={isPending}
      />

      <EditCategoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        categoryName={categoryToEdit}
      />
    </main>
  );
}
