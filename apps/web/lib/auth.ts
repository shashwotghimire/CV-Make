import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma, Role } from "@cvmake/db";
import { redirect } from "next/navigation";

export async function requireClerkUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export async function getOrCreateProfile() {
  const user = await requireClerkUser();

  return prisma.profile.upsert({
    where: { clerkUserId: user.id },
    update: {},
    create: { clerkUserId: user.id },
  });
}

export async function requireProfile() {
  const user = await requireClerkUser();
  const profile = await prisma.profile.upsert({
    where: { clerkUserId: user.id },
    update: {},
    create: { clerkUserId: user.id },
  });

  return { user, profile };
}

export async function requireAdminProfile() {
  const session = await requireProfile();

  if (session.profile.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return session;
}

export function needsOnboarding(profile: {
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
  bio: string | null;
}) {
  return !profile.phone || !profile.location || !profile.bio;
}

export async function getUserOverview() {
  const profiles = await prisma.profile.findMany({
    include: { cvs: true },
    orderBy: { createdAt: "desc" },
  });
  const client = await clerkClient();

  return Promise.all(
    profiles.map(async (profile) => {
      const user = await client.users.getUser(profile.clerkUserId).catch(() => null);

      return {
        id: profile.id,
        clerkUserId: profile.clerkUserId,
        role: profile.role,
        createdAt: profile.createdAt,
        cvCount: profile.cvs.length,
        name: user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : null,
        email: user?.emailAddresses[0]?.emailAddress ?? null,
      };
    }),
  );
}
