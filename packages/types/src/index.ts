import { z } from "zod";

export const roleSchema = z.enum(["USER", "ADMIN"]);
export type Role = z.infer<typeof roleSchema>;

export const itemTypeSchema = z.enum([
  "PROJECT",
  "EXPERIENCE",
  "EDUCATION",
  "SKILL",
  "CERTIFICATION",
]);
export type ItemType = z.infer<typeof itemTypeSchema>;

export const itemTagSchema = z.enum([
  "frontend",
  "backend",
  "fullstack",
  "academic",
  "internship",
  "featured",
  "recent",
  "archived",
]);

export const projectMetaSchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  field: z.string().optional(),
  gpa: z.string().optional(),
  coursework: z.array(z.string()).optional(),
  issuer: z.string().optional(),
  proficiency: z.string().optional(),
  category: z.string().optional(),
});

export const baseItemInputSchema = z.object({
  type: itemTypeSchema,
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  bullets: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  dateStart: z.string().optional().nullable(),
  dateEnd: z.string().optional().nullable(),
  url: z.string().url().optional().or(z.literal("")).nullable(),
  meta: projectMetaSchema.default({}),
});

export const profileInputSchema = z.object({
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const templateInputSchema = z.object({
  name: z.string().min(1),
  thumbnailUrl: z.string().url(),
  previewUrl: z.string().url(),
  templateHtml: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const cvInputSchema = z.object({
  name: z.string().min(1),
  templateId: z.string().min(1),
});

export const cvSectionInputSchema = z.object({
  title: z.string().min(1),
  order: z.number().int().nonnegative().default(0),
});

export const cvSectionItemInputSchema = z.object({
  itemId: z.string().min(1),
  order: z.number().int().nonnegative().default(0),
  customBullets: z.array(z.string()).default([]),
});

export const propagationSelectionSchema = z.object({
  cvId: z.string().min(1),
  sectionId: z.string().min(1).optional(),
  sectionTitle: z.string().min(1).optional(),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;
export type BaseItemInput = z.infer<typeof baseItemInputSchema>;
export type TemplateInput = z.infer<typeof templateInputSchema>;
export type CVInput = z.infer<typeof cvInputSchema>;
export type CVSectionInput = z.infer<typeof cvSectionInputSchema>;
export type CVSectionItemInput = z.infer<typeof cvSectionItemInputSchema>;
export type PropagationSelection = z.infer<typeof propagationSelectionSchema>;

export type RenderProfile = {
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  bio?: string | null;
};

export type RenderCVItem = {
  id: string;
  type: ItemType;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  bullets: string[];
  technologies: string[];
  tags: string[];
  url?: string | null;
  meta: Record<string, unknown>;
};

export type RenderCVSection = {
  id: string;
  title: string;
  order: number;
  items: RenderCVItem[];
};

export type RenderCVPayload = {
  profile: RenderProfile;
  cv: {
    id: string;
    name: string;
    updatedAt: string;
  };
  template: {
    id: string;
    name: string;
  };
  sections: RenderCVSection[];
};
