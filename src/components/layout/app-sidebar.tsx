"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Wrench, Settings, Box } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppSidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Chat",
      icon: MessageSquare,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Tools",
      icon: Wrench,
      href: "/tools",
      active: pathname === "/tools",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  return (
    <div className={cn("pb-12 w-64 border-r min-h-screen bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center pl-2 mb-6">
            <Box className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold tracking-tight">
              Nexus
            </h2>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
