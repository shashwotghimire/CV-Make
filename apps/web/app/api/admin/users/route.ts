import { NextResponse } from "next/server";
import { getUserOverview, requireAdminProfile } from "@/lib/auth";

export async function GET() {
  await requireAdminProfile();
  const users = await getUserOverview();
  return NextResponse.json(users);
}
