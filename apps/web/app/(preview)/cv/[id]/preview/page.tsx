import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@cvmake/db";
import { getCVRenderPayload, renderCVHtml } from "@/lib/render-cv";
import { requireReadyProfile } from "@/lib/profile-guard";

export default async function CVPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await requireReadyProfile();
  const user = await currentUser();
  const cv = await prisma.cV.findFirst({
    where: { id, profileId: profile.id },
    include: { template: true },
  });

  if (!cv || !user) {
    notFound();
  }

  const payload = await getCVRenderPayload(cv.id, {
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "CVMake User",
    email: user.emailAddresses[0]?.emailAddress ?? "unknown@example.com",
    avatar: user.imageUrl,
  });

  if (!payload) {
    notFound();
  }

  const html = renderCVHtml(payload, cv.template.templateHtml);

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl bg-white">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
