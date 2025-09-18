import { MealCategoriesClient } from "./_components/category-clients";
import { getCategoriesWithMealData } from "@/server/category/get-categories";

export const metadata = {
  title: "Categorias de Refeições",
  description: "Visualize todas as refeições agrupadas por categoria.",
};

export default async function Page() {
  const categoriesData = await getCategoriesWithMealData();

  return <MealCategoriesClient data={categoriesData} />;
}
