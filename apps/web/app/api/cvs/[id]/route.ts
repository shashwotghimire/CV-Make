import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { requireProfile } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { profile } = await requireProfile();
  const cv = await prisma.cV.findFirst({
    where: { id, profileId: profile.id },
    include: {
      template: true,
      sections: {
        include: { items: { include: { item: true } } },
      },
    },
  });

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(cv);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { profile } = await requireProfile();
  const body = (await request.json()) as {
    name?: string;
    templateId?: string;
    duplicate?: boolean;
  };

  const cv = await prisma.cV.findFirst({
    where: { id, profileId: profile.id },
    include: { sections: { include: { items: true } } },
  });

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.duplicate) {
    const duplicated = await prisma.cV.create({
      data: {
        profileId: profile.id,
        templateId: cv.templateId,
        name: `${cv.name} Copy`,
        sections: {
          create: cv.sections.map((section) => ({
            title: section.title,
            order: section.order,
            items: {
              create: section.items.map((item) => ({
                itemId: item.itemId,
                order: item.order,
                customBullets: item.customBullets,
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json(duplicated);
  }

  const updated = await prisma.cV.update({
    where: { id },
    data: {
      name: body.name,
      templateId: body.templateId,
      hasPendingUpdates: false,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { profile } = await requireProfile();
  const cv = await prisma.cV.findFirst({
    where: { id, profileId: profile.id },
  });

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cV.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
