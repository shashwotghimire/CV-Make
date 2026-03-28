import { PageShell } from "@cvmake/ui";
import { prisma } from "@cvmake/db";
import { CVCreateForm } from "@/components/cv-create-form";
import { requireReadyProfile } from "@/lib/profile-guard";

export default async function NewCVPage() {
  await requireReadyProfile();
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell
      title="Create a CV"
      description="Pick an active template first. The builder opens with an empty structure that you can shape section by section."
    >
      <CVCreateForm
        templates={templates.map((template) => ({
          id: template.id,
          name: template.name,
          thumbnailUrl: template.thumbnailUrl,
        }))}
      />
    </PageShell>
  );
}
