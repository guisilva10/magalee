import { getPatientDetails } from "@/server/sheet-data/get-sheet-all-data";
import { notFound } from "next/navigation";
import { PatientDetailClient } from "./_components/patient-detail-client";

export default async function PatientDetailPage({
  params,
}: {
  // Ajustado para receber string, que é o padrão do Next.js
  params: { id: string };
}) {
  // O ID vem da URL, então o decodificamos
  const userId = decodeURIComponent(params.id);
  // Chama a action atualizada
  const { patient, dietStatus, error } = await getPatientDetails(userId);

  if (!patient || error) {
    notFound();
  } // Passa o paciente completo e o status da dieta para o componente de cliente

  return <PatientDetailClient patient={patient} dietStatus={dietStatus} />;
}
