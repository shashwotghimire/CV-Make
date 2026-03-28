import { PageShell } from "@cvmake/ui";
import { prisma } from "@cvmake/db";
import { ItemsManager } from "@/components/items-manager";
import { requireReadyProfile } from "@/lib/profile-guard";

export default async function ItemsPage() {
  const { profile } = await requireReadyProfile();
  const [items, cvs] = await Promise.all([
    prisma.item.findMany({
      where: { profileId: profile.id },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.cV.findMany({
      where: { profileId: profile.id },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <PageShell
      title="Master items"
      description="Projects, experience, education, skills, and certifications live here first. CV sections only reference them."
    >
      <ItemsManager
        cvOptions={cvs.map((cv) => ({
          id: cv.id,
          name: cv.name,
        }))}
        items={items.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          dateStart: item.dateStart?.toISOString() ?? null,
          dateEnd: item.dateEnd?.toISOString() ?? null,
          url: item.url,
          location:
            item.meta && typeof item.meta === "object" && typeof (item.meta as Record<string, unknown>).location === "string"
              ? ((item.meta as Record<string, unknown>).location as string)
              : null,
          bullets: item.bullets,
          tags: item.tags,
          technologies: item.technologies,
        }))}
      />
    </PageShell>
  );
}
