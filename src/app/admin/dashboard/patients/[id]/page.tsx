import { getPatientDetails } from "@/server/sheet-data/get-sheet-all-data";
import { notFound } from "next/navigation";
import { PatientDetailClient } from "./_components/patient-detail-client";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // O ID vem decodificado da URL, então decodificamos
  const userId = decodeURIComponent((await params).id);
  const { patient, allMeals, dietStatus } = await getPatientDetails(userId);

  if (!patient) {
    notFound();
  }

  return (
    <PatientDetailClient
      patient={patient}
      allMeals={allMeals}
      dietStatus={dietStatus}
    />
  );
}
