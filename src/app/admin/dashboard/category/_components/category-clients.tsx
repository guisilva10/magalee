"use client";

import { Button } from "@/app/_components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { DeleteCategoryAlert } from "./delete-category";
import { EditCategoryDialog } from "./edit-category";
import { CategoryDialog as CreateCategoryDialog } from "./create-category-dialog";
import { deleteCategory } from "@/server/category/delete-category";

interface MealItem {
  patientName: string;
  Calories: number;
}

interface CategoryData {
  CategoryID: string;
  CategoryName: string;
  Description: string;
  totalCalories: number;
  mealCount: number;
  meals: MealItem[];
}

export function MealCategoriesClient({ data }: { data: CategoryData[] }) {
  const [isPending, startTransition] = useTransition();

  // Estados para controlar a visibilidade dos modais
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Estados para armazenar os dados da categoria selecionada para uma ação
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryData | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(
    null,
  );

  // Abre o modal de edição com os dados da categoria clicada
  const handleEditClick = (category: CategoryData) => {
    setCategoryToEdit(category);
    setIsEditDialogOpen(true);
  };

  // Abre o alerta de exclusão com os dados da categoria clicada
  const handleDeleteClick = (category: CategoryData) => {
    setCategoryToDelete(category);
    setIsAlertOpen(true);
  };

  // Executa a server action para excluir a categoria
  const confirmDelete = () => {
    if (!categoryToDelete) return;

    startTransition(async () => {
      const result = await deleteCategory(categoryToDelete.CategoryID);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      setIsAlertOpen(false);
      setCategoryToDelete(null);
    });
  };

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categorias</h1>
            <p className="text-muted-foreground">
              Gerencie as categorias de alimentos e refeições
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        {!data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Nenhuma Categoria Criada
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Clique em "Nova Categoria" para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((category) => (
              <div
                key={category.CategoryID}
                className="bg-input/20 flex flex-wrap items-center justify-between gap-4 rounded-lg border p-6 shadow-sm"
              >
                <div className="min-w-[250px] flex-1">
                  <h2 className="text-lg font-semibold">
                    {category.CategoryName}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {category.Description || "Sem descrição"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground text-sm">
                    {category.mealCount} refeições
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(category)}
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Renderização dos modais e alertas com os props corretos */}
      <CreateCategoryDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <EditCategoryDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={categoryToEdit}
      />
      <DeleteCategoryAlert
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        categoryName={categoryToDelete?.CategoryName}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </main>
  );
}
