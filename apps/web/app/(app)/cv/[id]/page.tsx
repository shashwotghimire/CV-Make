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
          type: item.type,
          tags: item.tags,
        }))}
        previewHref={`/cv/${cv.id}/preview`}
        sections={cv.sections.map((section) => ({
          id: section.id,
          title: section.title,
          order: section.order,
          items: section.items.map((entry) => ({
            id: entry.id,
            itemId: entry.itemId,
            order: entry.order,
            customBullets: entry.customBullets,
            item: {
              id: entry.item.id,
              title: entry.item.title,
              type: entry.item.type,
              tags: entry.item.tags,
            },
          })),
        }))}
      />
    </PageShell>
  );
}
