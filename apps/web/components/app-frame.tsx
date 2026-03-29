import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/clerk-config";
import { AppNavbar } from "./app-navbar";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] px-4 py-5 md:px-6">
      <AppNavbar />
      <main className="panel min-w-0 p-5 md:p-7">
        <div className="mb-5 flex items-center justify-end">
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
