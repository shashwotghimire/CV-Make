import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { requireProfile } from "@/lib/auth";

const defaultSectionTitleByType: Record<string, string> = {
  PROJECT: "Projects",
  EXPERIENCE: "Experience",
  EDUCATION: "Education",
  SKILL: "Skills",
  CERTIFICATION: "Certifications",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { profile } = await requireProfile();
  const body = (await request.json()) as {
    cvIds: string[];
    sectionTitle?: string;
  };

  const item = await prisma.item.findFirst({
    where: { id, profileId: profile.id },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const cvs = await prisma.cV.findMany({
    where: {
      id: { in: body.cvIds },
      profileId: profile.id,
    },
    include: { sections: true },
  });

  await Promise.all(
    cvs.map(async (cv) => {
      const targetTitle = body.sectionTitle || defaultSectionTitleByType[item.type] || "Highlights";
      const existingSection = cv.sections.find((section) => section.title === targetTitle);
      const section =
        existingSection ??
        (await prisma.cVSection.create({
          data: {
            cvId: cv.id,
            title: targetTitle,
            order: cv.sections.length,
          },
        }));

      const existingItems = await prisma.cVSectionItem.count({
        where: { sectionId: section.id },
      });

      await prisma.cVSectionItem.upsert({
        where: { sectionId_itemId: { sectionId: section.id, itemId: item.id } },
        update: {},
        create: {
          sectionId: section.id,
          itemId: item.id,
          order: existingItems,
          customBullets: [],
        },
      });

      await prisma.cV.update({
        where: { id: cv.id },
        data: { hasPendingUpdates: false },
      });
    }),
  );

  return NextResponse.json({ ok: true, linkedCVCount: cvs.length });
}
