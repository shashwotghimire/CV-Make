import Link from "next/link";
import { LayoutDashboard, FileStack, FolderKanban, Shield, Sparkles } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: FileStack },
  { href: "/profile/items", label: "Items", icon: Sparkles },
  { href: "/cv/new", label: "New CV", icon: FolderKanban },
  { href: "/admin/templates", label: "Admin", icon: Shield },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 rounded-[2rem] border border-black/10 bg-white/80 p-5 backdrop-blur md:block">
      <div className="mb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          CVMake
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Career source of truth.
        </h2>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-amber-50 hover:text-slate-950"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
