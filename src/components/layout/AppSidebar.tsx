
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const menuItems = [
    { label: "Buscar Voos", href: "/busca-voos" },
    { label: "Meus Voos", href: "/meus-voos" },
    { label: "Destinos Sustentáveis", href: "/destinos-sustentaveis" },
    { label: "Meu Perfil", href: "/perfil" },
    { label: "Suporte", href: "/suporte" },
  ];

  return (
    <Sidebar aria-label="Menu de navegação principal">
      <SidebarContent>
        <SidebarGroup className="px-2 pt-4">
          <div className="flex items-center justify-center mb-8 px-2">
            <div className="font-museomoderno font-bold text-3xl text-econotrip-blue">
              ECONOTRIP
            </div>
          </div>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="text-lg">
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
