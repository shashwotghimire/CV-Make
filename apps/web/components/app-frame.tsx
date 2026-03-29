import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/clerk-config";
import { AppSidebar } from "./app-sidebar";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] gap-5 px-4 py-5 md:px-6">
      <AppSidebar />
      <main className="panel min-w-0 flex-1 p-5 md:p-7">
        <div className="mb-6 flex items-center justify-end">
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
