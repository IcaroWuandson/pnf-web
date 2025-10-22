import { LayoutDashboard, Home, DollarSign, Tags } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppSidebar() {
  const navMain = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Visão Geral",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Categorias",
      url: "/categorias",
      icon: Tags,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center flex-row gap-2 mt-2">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center text-black">
            <DollarSign />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Button size="icon" variant="ghost">
                      <Link href={item.url}>{item.icon && <item.icon />}</Link>
                      <span
                        className="sr-only
                      "
                      >
                        {item.title}
                      </span>
                    </Button>
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
