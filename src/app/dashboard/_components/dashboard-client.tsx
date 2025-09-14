"use client";

import html2canvas from "html2canvas-pro";
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
  PieChart,
  Utensils,
  FileText,
  Download,
  Loader2,
  Share2,
  ChevronLeft,
  CalendarIcon,
  ChevronRight,
  Bell,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "../../_components/ui/button";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent, // Importe o DialogContent
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { SettingsSheet } from "./edit-patient-sheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Switch } from "@/app/_components/ui/switch";
import {
  deleteAlarm,
  updateAlarmStatus,
} from "@/server/sheet-data/update-alarm";
import { toast } from "sonner";
import { EditAlarmSheet } from "./edit-alarm-sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";

// --- Interfaces ---
interface Meal {
  date: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

interface Alarm {
  date: string;
  reminderText: string;
  fixedTime: string | null;
  frequencyMinutes: number | null; // Alterado de frequencyHours
  status: string;
  lastSent: string | null;
  uniqueId: string;
}

interface WaterLog {
  date: string;
  amount_ml: number;
}
interface PatientData {
  userId: string;
  name: string;
  caloriesTarget: string;
  proteinTarget: string;
  meals: Meal[];
  waterLogs: WaterLog[];
  alarms: Alarm[];
}

interface DashboardClientProps {
  data: PatientData | null;
}
type ConsumedTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const formatFrequency = (minutes: number | null): string | null => {
  if (!minutes || minutes <= 0) {
    return null;
  }
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `A cada ${hours} ${hours > 1 ? "horas" : "hora"}`;
  }
  return `A cada ${minutes} ${minutes > 1 ? "minutos" : "minuto"}`;
};

// --- Diet Status Logic ---
const getDietStatus = (
  consumedTotals: ConsumedTotals,
  patientData: PatientData,
) => {
  const targetCalories = Number(patientData.caloriesTarget);
  const targetProtein = Number(patientData.proteinTarget);

  const calorieRatio = consumedTotals.calories / targetCalories;
  const proteinRatio = consumedTotals.protein / targetProtein;

  if (calorieRatio >= 0.9 && calorieRatio <= 1.1 && proteinRatio >= 0.85) {
    return {
      status: "Saudável",
      message:
        "Parabéns! Você está seguindo o plano de perto e atingindo suas metas de calorias e proteínas.",
      color: "text-green-600",
    };
  }
  if (calorieRatio > 1.1) {
    return {
      status: "Precisa de Atenção",
      message:
        "Você consumiu mais calorias do que a sua meta. Tente focar em porções menores ou alimentos menos calóricos.",
      color: "text-orange-600",
    };
  }
  if (calorieRatio < 0.9) {
    return {
      status: "Precisa de Atenção",
      message:
        "Você consumiu menos calorias que a sua meta. É importante garantir que você está nutrindo seu corpo adequadamente.",
      color: "text-orange-600",
    };
  }
  if (proteinRatio < 0.85) {
    return {
      status: "Precisa de Atenção",
      message:
        "Sua ingestão de proteínas está abaixo do recomendado. Considere adicionar fontes de proteína magra às suas refeições.",
      color: "text-yellow-600",
    };
  }
  return {
    status: "Dados Incompletos",
    message: "Não foi possível analisar sua dieta com os dados atuais.",
    color: "text-gray-600",
  };
};

// --- COMPONENTE DO DIALOG REFATORADO ---
// Agora ele apenas renderiza o conteúdo e é controlado por props
const ReportSheet = ({
  isOpen,
  onOpenChange,
  data,
  consumedTotals,
  consumedWater,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: PatientData;
  consumedTotals: ConsumedTotals;
  consumedWater: number;
}) => {
  const dietStatus = getDietStatus(consumedTotals, data);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex w-full flex-col overflow-y-auto px-4 py-4 sm:max-w-sm"
      >
        <SheetHeader>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <SheetTitle>Relatório Nutricional</SheetTitle>
              <SheetDescription>
                Resumo do seu dia, {data.name}.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="p-6 pt-2">
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-lg border bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-800">
                Status da Alimentação
              </h3>
              <p className={`mt-2 text-lg font-bold ${dietStatus.color}`}>
                {dietStatus.status}
              </p>
              <p className="mt-1 text-sm text-gray-600">{dietStatus.message}</p>
            </div>
            <div className="rounded-lg border bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-800">Resumo de Metas</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Calorias:</span>{" "}
                  <span className="font-medium">
                    {consumedTotals.calories} / {data.caloriesTarget} kcal
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Hidratação Total:</span>{" "}
                  <span className="font-medium">
                    {consumedWater.toFixed(1)} L
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Proteínas:</span>{" "}
                  <span className="font-medium">
                    {consumedTotals.protein} / {data.proteinTarget} g
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Carboidratos:</span>{" "}
                  <span className="font-medium">{consumedTotals.carbs} g</span>
                </li>
                <li className="flex justify-between">
                  <span>Gorduras:</span>{" "}
                  <span className="font-medium">{consumedTotals.fats} g</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">
              Refeições Registradas
            </h3>
            <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border bg-gray-50 pr-2">
              <ul className="divide-y">
                {data.meals.length > 0 ? (
                  data.meals.map((meal, index) => (
                    <li
                      key={index}
                      className="flex justify-between p-3 text-sm"
                    >
                      <span>{meal.description}</span>
                      <span className="font-medium text-gray-700">
                        {meal.calories} kcal
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-sm text-gray-500">
                    Nenhuma refeição registrada.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// --- Main Components ---
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
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
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
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.icon}`}
        >
          <Icon className="size-4" />
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
    </div>
  );
};

const MetricCard = ({
  title,
  value, // O valor atual consumido
  unit,
  color,
  icon: Icon,
  description, // Prop opcional para a descrição
  target, // Prop opcional para a meta (controla a barra de progresso)
}: {
  title: string;
  value: number;
  unit: string;
  color: "green" | "blue" | "orange";
  icon: React.ElementType;
  description?: string;
  target?: number;
}) => {
  const colorClasses = {
    green: {
      icon: "bg-green-500 text-white",
      valueText: "text-green-600",
      progress: "bg-green-500",
      progressBg: "bg-green-100",
    },
    blue: {
      icon: "bg-blue-500 text-white",
      valueText: "text-blue-600",
      progress: "bg-blue-500",
      progressBg: "bg-blue-100",
    },
    orange: {
      icon: "bg-orange-500 text-white",
      valueText: "text-orange-600",
      progress: "bg-orange-500",
      progressBg: "bg-orange-100",
    },
  };
  const colors = colorClasses[color];

  // Calcula a porcentagem apenas se houver uma meta
  const percentage =
    target && target > 0 ? Math.round((value / target) * 100) : 0;

  // Formata o valor principal (ex: 1.8 ou 1500)
  const formattedValue =
    typeof value === "number" && value % 1 !== 0
      ? value.toFixed(1)
      : value.toLocaleString("pt-BR");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.icon}`}
        >
          <Icon className="size-4" />
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className={`text-3xl font-bold ${colors.valueText} mb-1`}>
            {formattedValue}
            <span className="ml-1 text-2xl font-medium text-gray-500">
              {unit}
            </span>
          </div>
          {/* Renderiza a descrição se ela for fornecida */}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        {/* Renderiza a barra de progresso APENAS se uma meta (target) for fornecida */}
        {target && (
          <div className="space-y-2">
            <div className="text-right text-sm text-gray-500">
              de {target.toLocaleString("pt-BR")} {unit}
            </div>
            <div
              className={`h-2 w-full ${colors.progressBg} overflow-hidden rounded-full`}
            >
              <div
                className={`h-full ${colors.progress} transition-all duration-500 ease-out`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className={`text-sm font-medium ${colors.valueText}`}>
              {percentage}% da meta
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ShareDialog = ({
  isOpen,
  onOpenChange,
  data,
  consumedTotals,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: PatientData;
  consumedTotals: ConsumedTotals;
}) => {
  const shareableCardRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const dietStatus = getDietStatus(consumedTotals, data);

  const handleGenerateImage = async () => {
    if (!shareableCardRef.current) {
      console.error("Elemento para compartilhamento não encontrado.");
      return;
    }
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const canvas = await html2canvas(shareableCardRef.current, {
        useCORS: true,
        scale: 2.5,
        backgroundColor: null,
      });
      const imageUrl = canvas.toDataURL("image/png", 0.95);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `relatorio-nutricional-${data.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const resetGenerator = () => setGeneratedImage(null);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetGenerator();
        onOpenChange(open);
      }}
    >
      <SheetContent
        side="left"
        className="flex w-full flex-col overflow-y-auto px-4 py-4 sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle>Compartilhar Relatório</SheetTitle>
          <SheetDescription>
            {generatedImage
              ? "Sua imagem está pronta!"
              : "Gere uma imagem do seu resumo diário."}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Relatório Nutricional Gerado"
              className="border-border w-full rounded-lg border shadow-md"
            />
          ) : (
            <div
              ref={shareableCardRef}
              className="rounded-lg border p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-primary text-xl font-bold">
                  Resumo Diário
                </h3>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                  {data.name}
                </span>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-md bg-white/70 p-3 text-center">
                  <p className="text-xs text-gray-600">Calorias</p>
                  <p className="text-lg font-bold text-green-600">
                    {consumedTotals.calories}
                    <span className="text-sm text-gray-500">
                      /{data.caloriesTarget} kcal
                    </span>
                  </p>
                </div>
                <div className="rounded-md bg-white/70 p-3 text-center">
                  <p className="text-xs text-gray-600">Proteínas</p>
                  <p className="text-lg font-bold text-orange-600">
                    {consumedTotals.protein}
                    <span className="text-sm text-gray-500">
                      /{data.proteinTarget} g
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-md bg-white/70 p-4">
                <h4 className={`text-md font-bold ${dietStatus.color}`}>
                  {dietStatus.status}
                </h4>
                <p className="mt-1 text-xs text-gray-700">
                  {dietStatus.message}
                </p>
              </div>
              <p className="mt-4 text-center text-xs text-teal-600">
                Gerado por Magalee App
              </p>
            </div>
          )}
        </div>
        <SheetFooter>
          {generatedImage ? (
            <>
              <Button onClick={resetGenerator} variant="outline">
                Gerar Novamente
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 size-4" />
                Baixar
              </Button>
            </>
          ) : (
            <Button
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Share2 className="mr-2 size-4" />
              )}
              {isGenerating ? "Gerando..." : "Gerar Imagem"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const MobileMenu = ({
  data,
  onReportClick,
  onSettingsClick,
  onShareClick,
}: {
  data: PatientData;
  onReportClick: () => void;
  onSettingsClick: () => void;
  onShareClick: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b p-4 text-left">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Target className="h-5 w-5 text-white" />
            </div>
            <SheetTitle className="text-xl font-bold text-gray-900">
              NutriDash
            </SheetTitle>
          </div>
          <p className="pt-2 text-sm text-gray-600">Olá, {data.name}!</p>
        </SheetHeader>
        <div className="space-y-4 p-2 pt-8">
          <Button
            onClick={() => handleLinkClick(onReportClick)}
            className="flex w-full items-center justify-start rounded-lg bg-teal-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-600"
          >
            <FileText className="size-4" /> Meu Relatório
          </Button>
          <Button
            onClick={() => handleLinkClick(onShareClick)}
            variant="ghost"
            className="flex w-full items-center justify-start px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Share className="size-4" /> Compartilhar
          </Button>
          <Button
            onClick={() => handleLinkClick(onSettingsClick)}
            variant="ghost"
            className="flex w-full items-center justify-start px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings className="size-4" /> Configurações
          </Button>
          <hr className="my-4" />
          <Button
            onClick={() => signOut()}
            variant="ghost"
            className="flex w-full items-center justify-start px-4 py-3 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOutIcon className="text-destructive mr-2 size-4" /> Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const dateToYyyyMmDd = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoje";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ontem";
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(date);
};

// --- COMPONENTE PRINCIPAL AJUSTADO ---
export default function DashboardClient({ data }: DashboardClientProps) {
  // Estado para controlar a abertura/fechamento do dialog
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [alarms, setAlarms] = useState(data?.alarms || []);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [deletingAlarm, setDeletingAlarm] = useState<Alarm | null>(null);

  // NOVO: Funções para navegar entre os dias
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const filteredMeals = useMemo(() => {
    if (!data?.meals) return [];
    const dateString = dateToYyyyMmDd(selectedDate);
    return data.meals.filter((meal) => meal.date === dateString);
  }, [data, selectedDate]);

  // Filtra os registros de água com base na data selecionada
  const filteredWaterLogs = useMemo(() => {
    if (!data?.waterLogs) return [];
    const dateString = dateToYyyyMmDd(selectedDate);
    return data.waterLogs.filter((log) => log.date === dateString);
  }, [data, selectedDate]);

  const consumedTotals = useMemo(() => {
    // A dependência agora é `filteredMeals`, não `data`
    return filteredMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fats += meal.fats;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    );
  }, [filteredMeals]);

  const consumedWaterLiters = useMemo(() => {
    const totalMl = filteredWaterLogs.reduce(
      (acc, log) => acc + log.amount_ml,
      0,
    );
    return totalMl / 1000;
  }, [filteredWaterLogs]);

  const [isPending, startTransition] = useTransition();

  // NOVO: Efeito para sincronizar o estado com as props
  useEffect(() => {
    if (data?.alarms) {
      setAlarms(data.alarms);
    }
  }, [data?.alarms]);

  const handleStatusChange = (uniqueId: string, newStatus: boolean) => {
    setAlarms((currentAlarms) =>
      currentAlarms.map((alarm) =>
        alarm.uniqueId === uniqueId
          ? { ...alarm, status: newStatus ? "ativo" : "desativado" }
          : alarm,
      ),
    );

    startTransition(async () => {
      const result = await updateAlarmStatus(uniqueId, newStatus);
      toast.success("Status do alarme atualizado com sucesso!.");
      if (!result.success) {
        console.error("Falha ao atualizar o alarme:", result.message);
        setAlarms(data?.alarms || []);
        toast.error("Não foi possível atualizar o alarme. Tente novamente.");
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingAlarm) return;

    startTransition(async () => {
      const result = await deleteAlarm(deletingAlarm.uniqueId);
      if (result.success) {
        toast.success("Alarme excluído com sucesso!.");
      } else {
        toast.error(`Erro: ${result.message}`);
      }
      setDeletingAlarm(null);
    });
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                <img
                  src="/logo.svg"
                  alt="Logo da Magalee"
                  className="h-5 w-5 text-white"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Magalee App</h1>
            </div>
            <div className="hidden text-sm text-gray-600 sm:block">
              Usuário não encontrado
            </div>
          </div>
        </header>
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border-gray-200 bg-white p-8 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Target className="h-8 w-8 text-gray-400" />
            </div>
            <div className="mt-6 space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Usuário não encontrado
              </h2>
              <p className="mx-auto max-w-sm text-sm text-gray-600">
                Não foi possível carregar seus dados nutricionais. Verifique se
                seu nome de usuário está correto na planilha.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalMacros =
    consumedTotals.carbs + consumedTotals.protein + consumedTotals.fats;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <header className="fixed top-0 right-0 left-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <MobileMenu
              data={data}
              onReportClick={() => setIsReportOpen(true)}
              onSettingsClick={() => setIsSettingsOpen(true)}
              onShareClick={() => setIsShareOpen(true)}
            />
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                <img
                  src="/logo.svg"
                  alt="Logo da Magalee"
                  className="h-5 w-5 text-white"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Magalee App</h1>
            </div>
            <div className="hidden text-sm text-gray-600 md:block">
              Olá, {data.name}!
            </div>
          </div>
          {/* BOTÕES DO HEADER DESKTOP */}
          <div className="hidden items-center space-x-3 md:flex">
            {/* NOVO BOTÃO "MEU RELATÓRIO" */}
            <Button
              onClick={() => setIsReportOpen(true)} // Ação para abrir o dialog
              className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
            >
              <FileText className="size-4" />
              Meu Relatório
            </Button>
            <Button
              onClick={() => setIsShareOpen(true)}
              variant="ghost"
              className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-gray-900"
            >
              <Share className="size-4" />
              <span className="text-sm">Compartilhar</span>
            </Button>
            <Button
              onClick={() => setIsSettingsOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 p-0 transition-colors hover:bg-gray-300"
            >
              <Settings className="size-4 text-gray-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => signOut()}
              className="h-9 w-9 border"
            >
              <LogOutIcon className="text-destructive size-4" />
            </Button>
          </div>
          <div className="block text-sm text-gray-600 md:hidden">
            {data.name}
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-6 flex items-center justify-center space-x-4 rounded-lg border bg-white p-2 shadow-sm">
          <Button
            onClick={handlePreviousDay}
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2 text-center">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <span className="w-24 text-lg font-semibold text-gray-800">
              {formatDateForDisplay(selectedDate)}
            </span>
          </div>
          <Button
            onClick={handleNextDay}
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* ... (O restante do conteúdo da <main> permanece o mesmo) ... */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <MagaleeMetricCard
            title="Calorias"
            current={consumedTotals.calories}
            target={Number(data.caloriesTarget)}
            unit="kcal"
            color="green"
            icon={Target}
          />
          <MetricCard
            title="Hidratação"
            value={consumedWaterLiters}
            description="Consumido hoje"
            unit="L"
            color="blue"
            icon={Droplets}
          />
          <MagaleeMetricCard
            title="Proteína"
            current={consumedTotals.protein}
            target={Number(data.proteinTarget)}
            unit="g"
            color="orange"
            icon={Zap}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center space-x-3 p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                <PieChart className="size-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Distribuição de Macronutrientes
                </h3>
                <p className="text-sm text-gray-600">Consumo total do dia</p>
              </div>
            </div>
            <div className="p-6 pt-0">
              {totalMacros > 0 ? (
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                      <span>Carboidratos</span>
                      <span>{consumedTotals.carbs}g</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-green-500"
                        style={{
                          width: `${(consumedTotals.carbs / totalMacros) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                      <span>Proteínas</span>
                      <span>{consumedTotals.protein}g</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-orange-500"
                        style={{
                          width: `${(consumedTotals.protein / totalMacros) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                      <span>Gorduras</span>
                      <span>{consumedTotals.fats}g</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-red-500"
                        style={{
                          width: `${(consumedTotals.fats / totalMacros) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center text-gray-500">
                  Nenhuma refeição registrada hoje.
                </div>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center space-x-3 p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <TrendingUp className="size-4 text-white" />
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
            <div className="p-6 pt-0">
              <div className="flex h-32 items-center justify-center text-gray-500">
                Gráfico de evolução em breve
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center space-x-3 p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                <Calendar className="size-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Refeições de Hoje</h3>
            </div>
            <div className="p-6 pt-0">
              {filteredMeals.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredMeals.map((meal, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between py-4"
                    >
                      <p className="flex-1 pr-4 text-sm font-medium text-gray-800">
                        {meal.description}
                      </p>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {meal.calories} kcal
                        </p>
                        <p className="text-xs text-gray-500">
                          {meal.carbs}g C, {meal.protein}g P, {meal.fats}g F
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-32 items-center justify-center text-gray-500">
                  Nenhuma refeição encontrada para hoje.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center space-x-3 p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                <Bell className="size-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Meus Lembretes e Alarmes
              </h3>
            </div>
            <div className="p-6 pt-0">
              {alarms.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {alarms.map((alarm) => {
                    const frequencyText = formatFrequency(
                      alarm.frequencyMinutes,
                    );

                    return (
                      <li
                        key={alarm.uniqueId}
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex-1 pr-4">
                          <p className="text-sm font-medium text-gray-800">
                            {alarm.reminderText}
                          </p>
                          <p className="text-xs text-gray-500">
                            <p className="text-xs text-gray-500">
                              {alarm.fixedTime
                                ? `Horário fixo: ${alarm.fixedTime}`
                                : frequencyText}
                            </p>
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alarm.status === "ativo"}
                            onCheckedChange={(newStatus) =>
                              handleStatusChange(alarm.uniqueId, newStatus)
                            }
                            disabled={isPending} // Desabilita enquanto a action está rodando
                            aria-label={`Ativar ou desativar o alarme: ${alarm.reminderText}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingAlarm(alarm)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                            onClick={() => setDeletingAlarm(alarm)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex h-32 items-center justify-center text-gray-500">
                  Nenhum alarme configurado.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* RENDERIZA O DIALOG CONTROLADO PELO ESTADO */}
      <ReportSheet
        isOpen={isReportOpen}
        onOpenChange={setIsReportOpen}
        data={data}
        consumedTotals={consumedTotals}
        consumedWater={consumedWaterLiters}
      />
      <SettingsSheet
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        data={data}
      />
      <ShareDialog
        isOpen={isShareOpen}
        onOpenChange={setIsShareOpen}
        data={data}
        consumedTotals={consumedTotals}
      />
      <EditAlarmSheet
        isOpen={!!editingAlarm}
        onOpenChange={() => setEditingAlarm(null)}
        alarm={editingAlarm}
      />

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog
        open={!!deletingAlarm}
        onOpenChange={() => setDeletingAlarm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O alarme{" "}
              <span className="font-semibold">
                "{deletingAlarm?.reminderText}"
              </span>{" "}
              será permanentemente removido da sua planilha.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingAlarm(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirmar Exclusão"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
