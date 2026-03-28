import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { baseItemInputSchema } from "@cvmake/types";
import { requireProfile } from "@/lib/auth";
import { parseDate } from "@/lib/utils";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { profile } = await requireProfile();
  const payload = baseItemInputSchema.partial().parse(await request.json());

  const item = await prisma.item.findFirst({
    where: { id, profileId: profile.id },
    include: { cvSectionItems: { include: { section: true } } },
  });

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.item.update({
    where: { id },
    data: {
      type: payload.type,
      title: payload.title,
      subtitle: payload.subtitle,
      description: payload.description,
      bullets: payload.bullets,
      technologies: payload.technologies,
      tags: payload.tags,
      dateStart:
        payload.dateStart === undefined ? undefined : parseDate(payload.dateStart),
      dateEnd: payload.dateEnd === undefined ? undefined : parseDate(payload.dateEnd),
      url: payload.url,
      meta: payload.meta,
    },
  });

  const cvIds = [...new Set(item.cvSectionItems.map((entry) => entry.section.cvId))];

  if (cvIds.length) {
    await prisma.cV.updateMany({
      where: { id: { in: cvIds } },
      data: { hasPendingUpdates: true },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { profile } = await requireProfile();

  const item = await prisma.item.findFirst({
    where: { id, profileId: profile.id },
  });

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
