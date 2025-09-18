import {
  ChartColumnBigIcon,
  LifeBuoy,
  Send,
  Settings,
  Users2Icon,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Visão Geral",
      url: "/admin/dashboard",
      icon: ChartColumnBigIcon,
      isActive: true,
    },
    {
      title: "Pacientes",
      url: "/admin/dashboard/patients",
      icon: Users2Icon,
    },

    {
      title: "Categorias",
      url: "/admin/dashboard/category",
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
