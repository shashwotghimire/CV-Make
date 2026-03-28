import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/clerk-config";
import { AppSidebar } from "./app-sidebar";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
      <AppSidebar />
      <main className="min-w-0 flex-1 rounded-[2rem] border border-black/10 bg-[rgba(255,253,246,0.84)] p-5 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.6)] backdrop-blur md:p-8">
        <div className="mb-8 flex items-center justify-end">
          {hasClerkPublishableKey ? (
            <UserButton />
          ) : (
            <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-500">
              Clerk env missing
            </span>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
