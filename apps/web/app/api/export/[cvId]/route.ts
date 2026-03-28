import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@cvmake/db";
import { uploadRawAsset } from "@/lib/cloudinary";
import { getCVRenderPayload, renderCVHtml } from "@/lib/render-cv";
import { requireReadyProfile } from "@/lib/profile-guard";
import { slugify } from "@/lib/utils";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ cvId: string }> },
) {
  const { cvId } = await params;
  const { profile } = await requireReadyProfile();
  const user = await currentUser();
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, profileId: profile.id },
    include: { template: true },
  });

  if (!cv || !user) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const payload = await getCVRenderPayload(cv.id, {
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "CVMake User",
    email: user.emailAddresses[0]?.emailAddress ?? "unknown@example.com",
    avatar: user.imageUrl,
  });

  if (!payload) {
    return NextResponse.json({ error: "Payload not found" }, { status: 404 });
  }

  const html = renderCVHtml(payload, cv.template.templateHtml);

  try {
    const { launch } = await import("puppeteer");
    const browser = await launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    const upload = await uploadRawAsset(
      Buffer.from(pdf).toString("base64"),
      `exports/${slugify(cv.name)}-${cv.id}`,
    );

    return NextResponse.json({
      url: upload.secure_url,
      expiresInHours: 24,
    });
  } catch (error) {
    console.error("PDF export failed", error);
    return NextResponse.json(
      { error: "Export failed. Check Puppeteer or Cloudinary config." },
      { status: 500 },
    );
  }
}
