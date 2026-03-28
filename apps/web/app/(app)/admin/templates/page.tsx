import { PageShell } from "@cvmake/ui";
import { prisma } from "@cvmake/db";
import { TemplateManager } from "@/components/template-manager";
import { requireAdminProfile } from "@/lib/auth";

export default async function AdminTemplatesPage() {
  await requireAdminProfile();
  const templates = await prisma.template.findMany({
    include: { cvs: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell
      title="Template admin"
      description="Upload and manage live resume templates. The same HTML powers builder preview and PDF export."
    >
      <TemplateManager
        templates={templates.map((template) => ({
          id: template.id,
          name: template.name,
          thumbnailUrl: template.thumbnailUrl,
          previewUrl: template.previewUrl,
          isActive: template.isActive,
          usageCount: template.cvs.length,
        }))}
      />
    </PageShell>
  );
}
