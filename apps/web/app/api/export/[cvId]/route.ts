import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@cvmake/db";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import { uploadRawAsset } from "@/lib/cloudinary";
import { getCVRenderPayload, renderCVHtml } from "@/lib/render-cv";
import { requireReadyProfile } from "@/lib/profile-guard";
import { slugify } from "@/lib/utils";

const localChromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export const runtime = "nodejs";

async function launchBrowser() {
  if (process.env.VERCEL) {
    const executablePath = await chromium.executablePath();
    return puppeteerCore.launch({
      executablePath,
      args: chromium.args,
      defaultViewport: { width: 1200, height: 1697 },
      headless: true,
    });
  }

  const puppeteer = await import("puppeteer");

  return puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || localChromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

async function buildPdf(cvId: string, profileId: string) {
  const user = await currentUser();
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, profileId },
    include: { template: true },
  });

  if (!cv || !user) {
    return null;
  }

  const payload = await getCVRenderPayload(cv.id, {
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "CVMake User",
    email: user.emailAddresses[0]?.emailAddress ?? "unknown@example.com",
    avatar: user.imageUrl,
  });

  if (!payload) {
    return null;
  }

  const html = renderCVHtml(payload, cv.template.templateHtml);
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return {
    cv,
    pdf,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cvId: string }> },
) {
  const { cvId } = await params;
  const { profile } = await requireReadyProfile();

  try {
    const result = await buildPdf(cvId, profile.id);

    if (!result) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return new NextResponse(Buffer.from(result.pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${slugify(result.cv.name)}.pdf"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("PDF preview failed", message, error);
    return NextResponse.json(
      { error: "Preview failed. Check Puppeteer configuration." },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ cvId: string }> },
) {
  const { cvId } = await params;
  const { profile } = await requireReadyProfile();

  try {
    const result = await buildPdf(cvId, profile.id);

    if (!result) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const upload = await uploadRawAsset(
      Buffer.from(result.pdf).toString("base64"),
      `exports/${slugify(result.cv.name)}-${result.cv.id}`,
    );

    return NextResponse.json({
      url: upload.secure_url,
      expiresInHours: 24,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("PDF export failed", message, error);
    return NextResponse.json(
      { error: "Export failed. Check Puppeteer or Cloudinary config." },
      { status: 500 },
    );
  }
}
