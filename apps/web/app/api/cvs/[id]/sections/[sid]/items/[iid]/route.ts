import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { requireProfile } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; sid: string; iid: string }> },
) {
  const { id, sid, iid } = await params;
  const { profile } = await requireProfile();
  const body = (await request.json()) as {
    order?: number;
    customBullets?: string[];
  };

  const link = await prisma.cVSectionItem.findFirst({
    where: {
      id: iid,
      sectionId: sid,
      section: {
        cvId: id,
        cv: { profileId: profile.id },
      },
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.cVSectionItem.update({
    where: { id: iid },
    data: {
      order: body.order,
      customBullets: body.customBullets,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; sid: string; iid: string }> },
) {
  const { id, sid, iid } = await params;
  const { profile } = await requireProfile();

  const link = await prisma.cVSectionItem.findFirst({
    where: {
      id: iid,
      sectionId: sid,
      section: {
        cvId: id,
        cv: { profileId: profile.id },
      },
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cVSectionItem.delete({ where: { id: iid } });
  return NextResponse.json({ ok: true });
}
