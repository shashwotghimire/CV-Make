import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { templateInputSchema } from "@cvmake/types";
import { requireAdminProfile } from "@/lib/auth";

export async function GET() {
  await requireAdminProfile();
  const templates = await prisma.template.findMany({
    include: { cvs: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    templates.map((template) => ({
      ...template,
      usageCount: template.cvs.length,
    })),
  );
}

export async function POST(request: Request) {
  await requireAdminProfile();
  const payload = templateInputSchema.parse(await request.json());

  const created = await prisma.template.create({ data: payload });
  return NextResponse.json(created);
}
