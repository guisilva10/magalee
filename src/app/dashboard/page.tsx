import DashboardClient from "./_components/dashboard-client";
import { auth } from "@/services/auth";
import { getPatientData } from "../_lib/google-sheet";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecionando para login...</p>
      </div>
    );
  }

  try {
    const dashboardData = await getPatientData(session.user.email);

    return <DashboardClient data={dashboardData} />;
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Erro ao carregar dados
          </h2>
          <p className="mb-4 text-gray-600">
            Não foi possível carregar seus dados nutricionais.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
}
