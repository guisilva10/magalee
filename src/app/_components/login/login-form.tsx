"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2Icon,
  LogInIcon,
  User,
  ShieldCheck,
} from "lucide-react";

// Componentes do Shadcn UI
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import Link from "next/link";

export default function LoginPage() {
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Efeito para mostrar toast de sucesso após o registro
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success(
        "Cadastro finalizado com sucesso! Agora você pode fazer o login.",
      );
      // Limpa a URL para que o toast não apareça novamente ao recarregar a página
      router.replace("/auth?tab=patient", { scroll: false });
    }
  }, [searchParams, router]);

  // --- ALTERAÇÃO 2: Lógica de login do paciente atualizada ---
  async function handlePatientLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!patientEmail || !patientPassword) {
      toast.error("Por favor, preencha e-mail e senha.");
      return;
    }

    startTransition(async () => {
      const res = await signIn("credentials", {
        // Envia email e senha, não mais o nome
        email: patientEmail,
        password: patientPassword,
        loginType: "patient",
        redirect: false,
      });

      if (!res?.error) {
        toast.success("Login realizado com sucesso!", {
          icon: <CheckCircle2 className="mr-2 size-4 text-green-500" />,
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Erro ao entrar. Verifique suas credenciais.");
      }
    });
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast.error("Por favor, preencha e-mail e senha.");
      return;
    }

    startTransition(async () => {
      const res = await signIn("credentials", {
        email: adminEmail,
        password: adminPassword,
        loginType: "admin",
        redirect: false,
      });

      if (!res?.error) {
        toast.success("Login de nutricionista realizado com sucesso!", {
          icon: <CheckCircle2 className="mr-2 size-4 text-green-500" />,
        });
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Credenciais de nutricionista inválidas.");
      }
    });
  }

  const defaultTab = searchParams.get("tab") || "patient";

  return (
    <div className="bg-muted/40 flex h-screen w-full flex-col lg:flex-row">
      <div className="flex h-screen w-full items-center justify-center p-4 text-xs lg:w-1/2 lg:p-0">
        <Tabs defaultValue={defaultTab} className="w-full max-w-md shadow-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Acesse sua conta
              </CardTitle>
              <CardDescription>
                Selecione seu tipo de acesso para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="patient">
                  <User className="mr-2 size-4" />
                  Paciente
                </TabsTrigger>
                <TabsTrigger value="admin">
                  <ShieldCheck className="mr-2 size-4" />
                  Nutricionista
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patient-email">Email</Label>
                      <Input
                        id="patient-email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        required
                        disabled={isPending}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="patient-password">Senha</Label>
                      <Input
                        id="patient-password"
                        type="password"
                        placeholder="••••••••"
                        value={patientPassword}
                        onChange={(e) => setPatientPassword(e.target.value)}
                        required
                        disabled={isPending}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                      ) : (
                        <LogInIcon className="mr-2 size-4" />
                      )}
                      Entrar como Paciente
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="magaleenutri@gmail.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        disabled={isPending}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        disabled={isPending}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                      ) : (
                        <LogInIcon className="mr-2 size-4" />
                      )}
                      Entrar como Nutricionista
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </CardContent>

            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              Voltar ao início
            </Link>
          </Card>
        </Tabs>
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
