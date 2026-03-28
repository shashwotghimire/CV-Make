import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { cvInputSchema } from "@cvmake/types";
import { requireProfile } from "@/lib/auth";

export async function GET() {
  const { profile } = await requireProfile();
  const cvs = await prisma.cV.findMany({
    where: { profileId: profile.id },
    include: { template: true, sections: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(cvs);
}

export async function POST(request: Request) {
  const { profile } = await requireProfile();
  const payload = cvInputSchema.parse(await request.json());

  const created = await prisma.cV.create({
    data: {
      profileId: profile.id,
      name: payload.name,
      templateId: payload.templateId,
    },
  });

  return NextResponse.json(created);
}
