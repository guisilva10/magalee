import { getDashboardData } from "@/server/sheet-data/get-sheet-all-data";
import PatientsDashboardClient from "./_components/patients-dashboard-client";

export default async function Page() {
  const patients = await getDashboardData();

  return <PatientsDashboardClient patients={patients} />;
}
