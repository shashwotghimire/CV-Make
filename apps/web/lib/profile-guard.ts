import { redirect } from "next/navigation";
import { needsOnboarding, requireProfile } from "./auth";

export async function requireReadyProfile() {
  const session = await requireProfile();

  if (needsOnboarding(session.profile)) {
    redirect("/onboarding");
  }

  return session;
}
