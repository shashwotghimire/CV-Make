import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { cvSectionInputSchema } from "@cvmake/types";
import { requireProfile } from "@/lib/auth";

async function getOwnedSection(cvId: string, sectionId: string, clerkProfileId: string) {
  return prisma.cVSection.findFirst({
    where: {
      id: sectionId,
      cvId,
      cv: { profileId: clerkProfileId },
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; sid: string }> },
) {
  const { id, sid } = await params;
  const { profile } = await requireProfile();
  const payload = cvSectionInputSchema.partial().parse(await request.json());

  const section = await getOwnedSection(id, sid, profile.id);

  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.cVSection.update({
    where: { id: sid },
    data: {
      title: payload.title,
      order: payload.order,
      summaryBullets: payload.summaryBullets,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; sid: string }> },
) {
  const { id, sid } = await params;
  const { profile } = await requireProfile();
  const section = await getOwnedSection(id, sid, profile.id);

  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cVSection.delete({ where: { id: sid } });
  return NextResponse.json({ ok: true });
}
