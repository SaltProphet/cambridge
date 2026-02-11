"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Video, Activity, Settings } from "lucide-react";

const navItems = [
  { href: "/creator", label: "Overview", icon: LayoutDashboard },
  { href: "/creator/rooms", label: "Rooms", icon: Video },
  { href: "/creator/usage", label: "Usage", icon: Activity },
  { href: "/admin", label: "Admin", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-b border-border mb-8">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              isActive
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
