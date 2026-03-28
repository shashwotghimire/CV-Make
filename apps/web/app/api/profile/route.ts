import { NextResponse } from "next/server";
import { prisma } from "@cvmake/db";
import { profileInputSchema } from "@cvmake/types";
import { requireProfile } from "@/lib/auth";

export async function GET() {
  const { profile } = await requireProfile();
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const { profile } = await requireProfile();
  const payload = profileInputSchema.parse(await request.json());

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: payload,
  });

  return NextResponse.json(updated);
}
