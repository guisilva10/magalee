import { getDashboardData } from "@/server/sheet-data/get-sheet-all-data";
import AdminDashboardPage from "./_components/admin-dashboard-client";

export default async function Page() {
  const dashboardData = await getDashboardData();

  return <AdminDashboardPage initialData={dashboardData} />;
}
