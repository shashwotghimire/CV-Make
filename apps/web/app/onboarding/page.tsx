import { PageShell } from "@cvmake/ui";
import { ProfileForm } from "@/components/profile-form";
import { requireProfile } from "@/lib/auth";

export default async function OnboardingPage() {
  const { profile, user } = await requireProfile();

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-12">
      <div className="w-full rounded-[2rem] border border-black/10 bg-white/90 p-8 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.6)]">
        <PageShell
          title={`Welcome, ${user.firstName ?? "there"}`}
          description="Finish the extended profile once. CVMake keeps identity in Clerk and career details in your app database."
        >
          <ProfileForm defaultValues={profile} onboarding />
        </PageShell>
      </div>
    </div>
  );
}
