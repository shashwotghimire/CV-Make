import type { ReactNode } from "react";
import { AppFrame } from "@/components/app-frame";
import { needsOnboarding, requireProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireProfile();

  if (needsOnboarding(profile)) {
    redirect("/onboarding");
  }

  return <AppFrame>{children}</AppFrame>;
}
