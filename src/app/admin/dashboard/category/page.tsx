import { getMealDataGroupedByCategory } from "@/server/sheet-data/get-category";
import { MealCategoriesClient } from "./_components/category-clients";

export const metadata = {
  title: "Categorias de Refeições",
  description: "Visualize todas as refeições agrupadas por categoria.",
};

export default async function Page() {
  const categoriesData = await getMealDataGroupedByCategory();

  return <MealCategoriesClient data={categoriesData} />;
}
