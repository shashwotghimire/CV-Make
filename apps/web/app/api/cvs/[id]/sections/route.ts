import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { cvSectionInputSchema } from "@cvmake/types";
import { requireProfile } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { profile } = await requireProfile();
  const payload = cvSectionInputSchema.parse(await request.json());

  const cv = await prisma.cV.findFirst({
    where: { id, profileId: profile.id },
  });

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const section = await prisma.cVSection.create({
    data: {
      cvId: cv.id,
      title: payload.title,
      order: payload.order,
      summaryBullets: payload.summaryBullets,
    },
  });

  return NextResponse.json(section);
}
