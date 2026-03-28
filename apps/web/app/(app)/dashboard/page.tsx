import Link from "next/link";
import { PageShell } from "@cvmake/ui";
import { prisma } from "@cvmake/db";
import { CVDashboard } from "@/components/cv-dashboard";
import { requireReadyProfile } from "@/lib/profile-guard";

export default async function DashboardPage() {
  const { profile } = await requireReadyProfile();
  const cvs = await prisma.cV.findMany({
    where: { profileId: profile.id },
    include: { template: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <PageShell
      title="Dashboard"
      description="Manage every CV version from one place. Quick actions keep edits, preview, and duplication fast."
      actions={
        <Link className="btn-primary" href="/cv/new">
          New CV
        </Link>
      }
    >
      <CVDashboard
        cvs={cvs.map((cv) => ({
          id: cv.id,
          name: cv.name,
          updatedAt: cv.updatedAt.toISOString(),
          hasPendingUpdates: cv.hasPendingUpdates,
          template: {
            name: cv.template.name,
            imageUrl: cv.template.previewUrl,
          },
        }))}
      />
    </PageShell>
  );
}
