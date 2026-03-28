# Thread Context Handoff

## Repo
- Path: `/Users/shiva/Developer/cv-app`
- App: Turborepo, Next.js fullstack in `apps/web`
- DB: Prisma + Neon Postgres
- Auth: Clerk
- Export: Handlebars + Puppeteer PDF

## Important project docs
- Plan: [/Users/shiva/Developer/cv-app/.codex/PLAN.md](/Users/shiva/Developer/cv-app/.codex/PLAN.md)
- Action log: [/Users/shiva/Developer/cv-app/.codex/SPECS.md](/Users/shiva/Developer/cv-app/.codex/SPECS.md)

## Current product direction
- User wants CV builder/output close to Overleaf SWE resume template
- Preview must be PDF, not HTML approximation
- Builder must support per-entry hierarchy:
  - CV section title
  - left heading
  - right-side date/info
  - next line subheading
  - right-side additional info
  - then bullets
- Rich text editing needed for bullets, using popular npm package

## What is already done
- Replaced custom bullet editor with `react-quill-new`
- Added rich formatting per bullet:
  - bold, italic, underline, strike
  - font, size
  - text/background color
  - lists, indent, links
- Added CV entry override fields on `CVSectionItem`:
  - `customTitle`
  - `customSubtitle`
  - `customRightTitle`
  - `customRightSubtitle`
  - `customBullets`
- `CVSection` has `summaryBullets`
- Builder UI supports editing those fields
- PDF render payload uses those fields
- Template seed/template manager updated toward Overleaf structure
- Preview uses `/api/export/[cvId]` PDF stream
- Preview route moved out of app shell route group earlier
- Prisma schema pushed to Neon
- Prisma client regenerated
- Dev server running

## Important files
- Builder: [/Users/shiva/Developer/cv-app/apps/web/components/cv-builder.tsx](/Users/shiva/Developer/cv-app/apps/web/components/cv-builder.tsx)
- Rich editor: [/Users/shiva/Developer/cv-app/apps/web/components/rich-bullet-editor.tsx](/Users/shiva/Developer/cv-app/apps/web/components/rich-bullet-editor.tsx)
- CV page: [/Users/shiva/Developer/cv-app/apps/web/app/(app)/cv/[id]/page.tsx](/Users/shiva/Developer/cv-app/apps/web/app/(app)/cv/[id]/page.tsx)
- Export route: [/Users/shiva/Developer/cv-app/apps/web/app/api/export/[cvId]/route.ts](/Users/shiva/Developer/cv-app/apps/web/app/api/export/[cvId]/route.ts)
- Render mapper: [/Users/shiva/Developer/cv-app/apps/web/lib/render-cv.ts](/Users/shiva/Developer/cv-app/apps/web/lib/render-cv.ts)
- Prisma schema: [/Users/shiva/Developer/cv-app/packages/db/prisma/schema.prisma](/Users/shiva/Developer/cv-app/packages/db/prisma/schema.prisma)
- Seed template: [/Users/shiva/Developer/cv-app/packages/db/prisma/seed.ts](/Users/shiva/Developer/cv-app/packages/db/prisma/seed.ts)
- Shared types: [/Users/shiva/Developer/cv-app/packages/types/src/index.ts](/Users/shiva/Developer/cv-app/packages/types/src/index.ts)

## Runtime state
- App URL: `http://localhost:3000`
- Recent dev session id used in thread: `94959`
- `pnpm typecheck` passes after latest changes
- Neon DB schema synced with latest Prisma changes

## Important environment notes
- Secrets were accidentally committed earlier through `.env.example`
- That was remediated by scrubbing file and rewriting Git history
- Even after rewrite, treat old secrets as rotated-required
- Current real env is local `.env`, not committed

## Known gaps / next likely work
- Template still not pixel-close to exact Overleaf screenshot
- Need dedicated visual fidelity pass on PDF HTML/CSS
- Likely need better field UX for items created directly in builder vs pulled from pool
- Might need richer item data model for education/experience/project-specific right-side defaults
- Could add drag reorder for sections/items later if user asks
- Middleware warning still exists: Next 16 wants `proxy.ts` instead of `middleware.ts`

## Suggested next steps for next agent
1. Open CV builder and inspect actual PDF output
2. Tighten template CSS to match Overleaf screenshot spacing, divider line, typography, and alignment
3. Verify education/experience/project entries render correctly with real sample data
4. Improve defaults for right-side date/location fields from item metadata
5. If user wants, commit and push after visual pass

## Validation commands used recently
- `pnpm typecheck`
- `set -a; source .env; set +a; pnpm db:push`
- `set -a; source .env; set +a; pnpm db:seed`
- `set -a; source .env; set +a; pnpm dev`

