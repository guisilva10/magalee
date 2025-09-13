// components/auth/patient-phone-form.tsx
"use client";

import { verifyPatientPhone } from "@/server/sheet-data/verify-number";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

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
    <div className="bg-muted/40 flex h-screen w-full flex-col lg:flex-row">
      <div className="flex h-screen w-full items-center justify-center p-4 text-xs lg:w-1/2 lg:p-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Acesso a Magalee
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Digite seu número de telefone para continuar.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={dispatch} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
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
                <p className="mt-2 text-center text-sm text-red-600">
                  {state.error}
                </p>
              )}
            </form>
            <CardFooter className="mt-5 flex items-center justify-center">
              <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                Voltar ao início
              </Link>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
      <div className="hidden h-screen w-1/2 items-center bg-[#00b39b] lg:flex">
        <div className="h-auto w-full">
          <img
            src="/bg-login.png"
            alt="Background da tela de Login"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
