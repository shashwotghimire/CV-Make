import { notFound } from "next/navigation";
import { PageShell } from "@cvmake/ui";
import { prisma } from "@cvmake/db";
import { CVBuilder } from "@/components/cv-builder";
import { requireReadyProfile } from "@/lib/profile-guard";

export default async function CVDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await requireReadyProfile();
  const cv = await prisma.cV.findFirst({
    where: { id, profileId: profile.id },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
            include: {
              item: true,
            },
          },
        },
      },
    },
  });
  const pool = await prisma.item.findMany({
    where: { profileId: profile.id },
    orderBy: { updatedAt: "desc" },
  });

  if (!cv) {
    notFound();
  }

  return (
    <PageShell
      title={cv.name}
      description="Builder view: create sections, pull in items from the master pool, and override bullets per CV when needed."
    >
      <CVBuilder
        cvId={cv.id}
        pool={pool.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          type: item.type,
          tags: item.tags,
          technologies: item.technologies,
          dateStart: item.dateStart?.toISOString() ?? null,
          dateEnd: item.dateEnd?.toISOString() ?? null,
          url: item.url,
          meta:
            item.meta && typeof item.meta === "object"
              ? (item.meta as Record<string, unknown>)
              : {},
        }))}
        previewHref={`/api/export/${cv.id}`}
        sections={cv.sections.map((section) => ({
          id: section.id,
          title: section.title,
          order: section.order,
          summaryBullets: section.summaryBullets,
          items: section.items.map((entry) => ({
            id: entry.id,
            itemId: entry.itemId,
            order: entry.order,
            customTitle: entry.customTitle,
            customSubtitle: entry.customSubtitle,
            customRightTitle: entry.customRightTitle,
            customRightSubtitle: entry.customRightSubtitle,
            customBullets: entry.customBullets,
            item: {
              id: entry.item.id,
              title: entry.item.title,
              subtitle: entry.item.subtitle,
              type: entry.item.type,
              tags: entry.item.tags,
              technologies: entry.item.technologies,
              dateStart: entry.item.dateStart?.toISOString() ?? null,
              dateEnd: entry.item.dateEnd?.toISOString() ?? null,
              url: entry.item.url,
              meta:
                entry.item.meta && typeof entry.item.meta === "object"
                  ? (entry.item.meta as Record<string, unknown>)
                  : {},
            },
          })),
        }))}
      />
    </PageShell>
  );
}
