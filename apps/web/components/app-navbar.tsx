"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileStack, FolderKanban, LayoutDashboard, Shield, Sparkles } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: FileStack },
  { href: "/profile/items", label: "Items", icon: Sparkles },
  { href: "/cv/new", label: "New CV", icon: FolderKanban },
  { href: "/admin/templates", label: "Admin", icon: Shield },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="panel mb-5 px-4 py-3 md:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">CVMake</p>
          <p className="text-sm text-slate-600">Profile-first resumes with role-specific variants.</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "border-teal-500/40 bg-teal-50 text-teal-800"
                    : "border-black/10 bg-white/90 text-slate-700 hover:border-teal-200 hover:bg-teal-50/60"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
