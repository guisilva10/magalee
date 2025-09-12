// components/auth/patient-phone-form.tsx
"use client";

import { verifyPatientPhone } from "@/server/sheet-data/verify-number";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-teal-500 p-3 text-white hover:bg-teal-600 disabled:bg-gray-400"
    >
      {pending ? "Verificando..." : "Continuar"}
    </button>
  );
}

export function PatientPhoneForm() {
  const [state, dispatch] = useActionState(verifyPatientPhone, {
    error: undefined,
  });

  return (
    <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow-md">
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Acesso do Paciente
      </h1>
      <p className="text-center text-gray-500">
        Digite seu número de telefone para continuar.
      </p>

      <form action={dispatch} className="space-y-4">
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Telefone (com DDD)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="(11) 99999-9999"
          />
        </div>
        <SubmitButton />
        {state?.error && (
          <p className="mt-2 text-center text-sm text-red-600">{state.error}</p>
        )}
      </form>
    </div>
  );
}
