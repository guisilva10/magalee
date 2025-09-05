import {
  ChartColumnBigIcon,
  LifeBuoy,
  Send,
  Settings,
  TrendingUpIcon,
  Users2Icon,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Visão Geral",
      url: "#",
      icon: ChartColumnBigIcon,
      isActive: true,
    },
    {
      title: "Pacientes",
      url: "#",
      icon: Users2Icon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: TrendingUpIcon,
    },
    {
      title: "Categorias",
      url: "#",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};
