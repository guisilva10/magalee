"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import Image from "next/image";

export default function LoginPage() {
  // Estados para os inputs dos dois formulários
  const [patientName, setPatientName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // A lógica das funções de login permanece exatamente a mesma
  async function handlePatientLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!patientName) {
      toast.error("Por favor, digite seu nome.");
      return;
    }

    startTransition(async () => {
      const res = await signIn("credentials", {
        name: patientName,
        loginType: "patient",
        redirect: false,
      });

      if (!res?.error) {
        toast.success("Login realizado com sucesso!", {
          icon: <CheckCircle2 className="mr-2 size-4 text-green-500" />,
        });
        router.push("/dashboard");
        router.refresh(); // Força a atualização da sessão no layout
      } else {
        toast.error(res.error || "Erro ao entrar. Verifique seu nome.");
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
        toast.success("Login de administrador realizado com sucesso!", {
          icon: <CheckCircle2 className="mr-2 size-4 text-green-500" />,
        });
        router.push("/admin/dashboard");
        router.refresh(); // Força a atualização da sessão no layout
      } else {
        toast.error(res.error || "Credenciais de administrador inválidas.");
      }
    });
  }

  return (
    <div className="bg-muted/40 flex h-screen w-full flex-col lg:flex-row">
      <div className="flex h-screen w-full items-center justify-center p-4 text-xs lg:w-1/2 lg:p-0">
        <Tabs defaultValue="patient" className="w-full max-w-md shadow-2xl">
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
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
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
            <CardFooter className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs lg:text-sm">
                Ainda não possuí uma conta ?
              </p>
              <Link
                href=""
                className="hover:text-primary text-xs font-bold lg:text-sm"
              >
                Crie sua conta por aqui
              </Link>
            </CardFooter>
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
