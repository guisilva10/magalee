"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar"; // Note que só precisamos de menos componentes agora
import { cn } from "@/app/_lib/utils";

// 1. Tipagem simplificada para refletir a nova estrutura de dados (sem 'items' aninhados)
export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

interface NavItemProps {
  items: NavItem[];
}

export function NavMain({ items }: NavItemProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegação</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.url === "/"
              ? pathname === item.url
              : pathname.startsWith(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(isActive && "bg-primary text-accent-foreground")}
              >
                <Link href={item.url}>
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
