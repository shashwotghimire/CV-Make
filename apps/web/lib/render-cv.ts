import Handlebars from "handlebars";
import { prisma } from "@cvmake/db";
import type { RenderCVPayload } from "@cvmake/types";

function formatMonthYear(value?: Date | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatDateRange(dateStart?: Date | null, dateEnd?: Date | null) {
  if (!dateStart && !dateEnd) return null;
  const start = formatMonthYear(dateStart);
  const end = formatMonthYear(dateEnd) || "Present";
  return [start, end].filter(Boolean).join(" - ");
}

export async function getCVRenderPayload(
  cvId: string,
  identity: { name: string; email: string; avatar?: string | null },
): Promise<RenderCVPayload | null> {
  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    include: {
      profile: true,
      template: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
            include: { item: true },
          },
        },
      },
    },
  });

  if (!cv) {
    return null;
  }

  return {
    profile: {
      name: identity.name,
      email: identity.email,
      avatar: identity.avatar ?? null,
      phone: cv.profile.phone,
      location: cv.profile.location,
      linkedin: cv.profile.linkedin,
      github: cv.profile.github,
      website: cv.profile.website,
      bio: cv.profile.bio,
    },
    cv: {
      id: cv.id,
      name: cv.name,
      updatedAt: cv.updatedAt.toISOString(),
    },
    template: {
      id: cv.template.id,
      name: cv.template.name,
    },
    sections: cv.sections.map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      summaryBullets: section.summaryBullets,
      items: section.items.map((entry) => ({
        id: entry.item.id,
        type: entry.item.type,
        title: entry.customTitle ?? entry.item.title,
        subtitle: entry.customSubtitle ?? entry.item.subtitle,
        rightTitle:
          entry.customRightTitle ??
          formatDateRange(entry.item.dateStart, entry.item.dateEnd),
        rightSubtitle:
          entry.customRightSubtitle ??
          (entry.item.meta &&
          typeof entry.item.meta === "object" &&
          typeof (entry.item.meta as Record<string, unknown>).location === "string"
            ? ((entry.item.meta as Record<string, unknown>).location as string)
            : null),
        description: entry.item.description,
        bullets: entry.customBullets.length ? entry.customBullets : entry.item.bullets,
        technologies: entry.item.technologies,
        tags: entry.item.tags,
        url: entry.item.url,
        meta:
          entry.item.meta && typeof entry.item.meta === "object" ? (entry.item.meta as Record<string, unknown>) : {},
      })),
    })),
  };
}

export function renderCVHtml(payload: RenderCVPayload, templateHtml: string) {
  const template = Handlebars.compile(templateHtml);
  return template(payload);
}
