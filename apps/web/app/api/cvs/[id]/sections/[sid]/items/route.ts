import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { cvSectionItemInputSchema } from "@cvmake/types";
import { requireProfile } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; sid: string }> },
) {
  const { id, sid } = await params;
  const { profile } = await requireProfile();
  const payload = cvSectionItemInputSchema.parse(await request.json());

  const section = await prisma.cVSection.findFirst({
    where: {
      id: sid,
      cvId: id,
      cv: { profileId: profile.id },
    },
  });

  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const link = await prisma.cVSectionItem.upsert({
    where: { sectionId_itemId: { sectionId: sid, itemId: payload.itemId } },
    update: {
      order: payload.order,
      customBullets: payload.customBullets,
    },
    create: {
      sectionId: sid,
      itemId: payload.itemId,
      order: payload.order,
      customBullets: payload.customBullets,
    },
  });

  await prisma.cV.update({
    where: { id },
    data: { hasPendingUpdates: false },
  });

  return NextResponse.json(link);
}
