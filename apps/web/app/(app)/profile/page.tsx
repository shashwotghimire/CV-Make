import { PageShell } from "@cvmake/ui";
import { ProfileForm } from "@/components/profile-form";
import { requireReadyProfile } from "@/lib/profile-guard";

export default async function ProfilePage() {
  const { profile } = await requireReadyProfile();

  return (
    <PageShell
      title="Extended profile"
      description="Clerk owns identity. CVMake stores the contact and bio fields that power every resume template."
    >
      <ProfileForm defaultValues={profile} />
    </PageShell>
  );
}
