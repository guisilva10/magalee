"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";

import {
  Target,
  Droplets,
  Zap,
  TrendingUp,
  Calendar,
  Settings,
  Share,
  X,
  LogOutIcon,
  Menu,
} from "lucide-react";
import { Button } from "../_components/ui/button";
import { signOut } from "next-auth/react";

// Tipagem para os dados do paciente
interface PatientData {
  userId: string;
  name: string;
  calories: string;
  protein: string;
}

// Tipagem para as props do componente
interface DashboardClientProps {
  data: PatientData | null;
}

// Componente para os cards de métricas estilo Magalee
const MagaleeMetricCard = ({
  title,
  current,
  target,
  unit,
  color,
  icon: Icon,
}: {
  title: string;
  current: number;
  target: number;
  unit: string;
  color: "green" | "blue" | "orange";
  icon: React.ElementType;
}) => {
  const percentage = Math.round((current / target) * 100);

  const colorClasses = {
    green: {
      icon: "bg-green-500 text-white",
      value: "text-green-600",
      progress: "bg-green-500",
      progressBg: "bg-green-100",
      percentage: "text-green-600",
    },
    blue: {
      icon: "bg-blue-500 text-white",
      value: "text-blue-600",
      progress: "bg-blue-500",
      progressBg: "bg-blue-100",
      percentage: "text-blue-600",
    },
    orange: {
      icon: "bg-orange-500 text-white",
      value: "text-orange-600",
      progress: "bg-orange-500",
      progressBg: "bg-orange-100",
      percentage: "text-orange-600",
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className="border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.icon}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className={`text-3xl font-bold ${colors.value} mb-1`}>
              {typeof current === "number" && current % 1 !== 0
                ? current.toFixed(1)
                : current.toLocaleString("pt-BR")}
              {unit}
            </div>
            <div className="text-sm text-gray-500">
              de {target.toLocaleString("pt-BR")}
              {unit}
            </div>
          </div>

          <div className="space-y-2">
            <div
              className={`h-2 w-full ${colors.progressBg} overflow-hidden rounded-full`}
            >
              <div
                className={`h-full ${colors.progress} transition-all duration-500 ease-out`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className={`text-sm font-medium ${colors.percentage}`}>
              {percentage}% da meta
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente do menu mobile
const MobileMenu = ({ data }: { data: PatientData }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-2">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">NutriDash</span>
          </SheetTitle>
          <div className="text-sm text-gray-600">Olá, {data.name}!</div>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          <Button className="w-full justify-start rounded-lg bg-teal-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-600">
            <Target className="mr-3 h-4 w-4" />
            Meu Relatório
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Share className="mr-3 h-4 w-4" />
            Compartilhar
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings className="mr-3 h-4 w-4" />
            Configurações
          </Button>

          <hr className="my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            onClick={() => signOut()}
          >
            <LogOutIcon className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default function DashboardClient({ data }: DashboardClientProps) {
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header estilo Magalee - Error State */}
        <header className="border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">NutriDash</h1>
              </div>
              <div className="hidden text-sm text-gray-600 sm:block">
                Usuário não encontrado
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                <X className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo de erro */}
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <Card className="w-full max-w-md border-gray-200 bg-white">
            <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Usuário não encontrado
                </h2>
                <p className="max-w-sm text-sm text-gray-600">
                  Não foi possível carregar seus dados nutricionais. Verifique
                  se seu nome de usuário está correto na planilha.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Simulando valores consumidos
  const consumedCalories = Math.floor(Number(data.calories) * 0.83);
  const consumedProtein = Math.floor(Number(data.protein) * 0.71);
  const consumedWater = 1.8;
  const targetWater = 2.5;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Header Desktop e Mobile */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6 py-8">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center space-x-4">
            <MobileMenu data={data} />
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">NutriDash</h1>
            </div>
            <div className="hidden text-sm text-gray-600 md:block">
              Olá, {data.name}!
            </div>
          </div>

          {/* Ações Desktop */}
          <div className="hidden items-center space-x-3 md:flex">
            <Button className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600">
              Meu Relatório
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-gray-900"
            >
              <Share className="h-4 w-4" />
              <span className="text-sm">Compartilhar</span>
            </Button>
            <Button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
              <Settings className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => signOut()}>
              <LogOutIcon />
            </Button>
          </div>

          {/* User info mobile */}
          <div className="block text-sm text-gray-600 md:hidden">
            {data.name}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="p-6">
        {/* Cards de métricas principais - estilo Magalee */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <MagaleeMetricCard
            title="Calorias"
            current={consumedCalories}
            target={Number(data.calories)}
            unit="kcal"
            color="green"
            icon={Target}
          />

          <MagaleeMetricCard
            title="Hidratação"
            current={consumedWater}
            target={targetWater}
            unit="L"
            color="blue"
            icon={Droplets}
          />

          <MagaleeMetricCard
            title="Proteína"
            current={consumedProtein}
            target={Number(data.protein)}
            unit="g"
            color="orange"
            icon={Zap}
          />
        </div>

        {/* Cards adicionais estilo Magalee */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Evolução do Peso
                  </h3>
                  <p className="text-sm text-gray-600">
                    Progresso dos últimos 7 dias
                  </p>
                </div>
              </div>
              <div className="flex h-32 items-center justify-center text-gray-500">
                Gráfico de evolução em breve
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Distribuição de Macronutrientes
                  </h3>
                  <p className="text-sm text-gray-600">
                    Percentual diário recomendado
                  </p>
                </div>
              </div>
              <div className="flex h-32 items-center justify-center text-gray-500">
                Gráfico de distribuição em breve
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card inferior */}
        <div className="mt-6">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Refeições de Hoje
                  </h3>
                </div>
              </div>
              <div className="flex h-32 items-center justify-center text-gray-500">
                Lista de refeições em breve
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
