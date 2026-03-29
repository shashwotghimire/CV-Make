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
    <aside className="panel hidden w-72 shrink-0 p-5 md:block">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">
          CVMake
        </p>
        <h2 className="text-[1.65rem] font-semibold tracking-tight text-slate-950">
          Career source of truth.
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Precision workflows for profile-first resume building.
        </p>
      </div>
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-100 hover:bg-teal-50/70 hover:text-slate-950"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-white/90 text-slate-500 transition group-hover:bg-white group-hover:text-teal-700">
                <Icon className="size-4" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
