import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { templateInputSchema } from "@cvmake/types";
import { requireAdminProfile } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await requireAdminProfile();
  const payload = templateInputSchema.partial().parse(await request.json());

  const updated = await prisma.template.update({
    where: { id },
    data: payload,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await requireAdminProfile();

  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
