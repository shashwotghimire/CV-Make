import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { baseItemInputSchema } from "@cvmake/types";
import { requireProfile } from "@/lib/auth";
import { parseDate } from "@/lib/utils";

export async function GET() {
  const { profile } = await requireProfile();
  const items = await prisma.item.findMany({
    where: { profileId: profile.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { profile } = await requireProfile();
  const payload = baseItemInputSchema.parse(await request.json());

  const created = await prisma.item.create({
    data: {
      profileId: profile.id,
      type: payload.type,
      title: payload.title,
      subtitle: payload.subtitle ?? null,
      description: payload.description ?? null,
      bullets: payload.bullets,
      technologies: payload.technologies,
      tags: payload.tags,
      dateStart: parseDate(payload.dateStart),
      dateEnd: parseDate(payload.dateEnd),
      url: payload.url || null,
      meta: payload.meta,
    },
  });

  const cvs = await prisma.cV.findMany({
    where: { profileId: profile.id },
    select: { id: true },
  });

  return NextResponse.json({
    ...created,
    propagationOptions: cvs,
  });
}
