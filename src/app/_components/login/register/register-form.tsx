"use client";

import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerPatient } from "@/server/patient/register-patient";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Finalizando..." : "Finalizar Cadastro"}
    </Button>
  );
}

interface RegisterFormProps {
  user: {
    id: string;
    name: string;
  };
}

export function RegisterForm({ user }: RegisterFormProps) {
  const initialState = { error: undefined, success: false };
  const [state, dispatch] = useActionState(registerPatient, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className="bg-muted/40 flex h-screen w-full flex-col lg:flex-row">
      <div className="flex h-screen w-full items-center justify-center p-4 text-xs lg:w-1/2 lg:p-0">
        <Card className="w-full lg:max-w-md">
          <CardHeader>
            <CardTitle>Bem-vindo(a), {user.name}!</CardTitle>
            <CardDescription>
              Para finalizar seu cadastro, crie um e-mail e uma senha de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="name" value={user.name} />

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              Voltar ao início
            </Link>
          </CardFooter>
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
