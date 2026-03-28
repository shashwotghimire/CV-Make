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
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.6)]">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
