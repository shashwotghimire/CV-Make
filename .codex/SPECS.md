# SPECS

## Current phase
P6 Propagation

## Action log
- 001 | P1 Foundation | created `.codex/PLAN.md` | build contract added
- 002 | P1 Foundation | created `.codex/SPECS.md` | action log started
- 003 | P1 Foundation | scaffolded `apps/web` Next app | base app generated
- 004 | P1 Foundation | converted repo to pnpm workspace + turbo | monorepo spine ready
- 005 | P1 Foundation | added `packages/db`, `packages/ui`, `packages/types` | shared packages ready
- 006 | P1 Foundation | added Prisma schema + seed | DB contract set
- 007 | P1 Foundation | wired app package to shared packages + Clerk shell | foundation in progress
- 008 | P1 Foundation | replaced starter app with CVMake routes/components | app skeleton live
- 009 | P2 Profile and Items | added profile + items pages and APIs | CRUD shell added
- 010 | P3 Template Admin | added admin templates/users pages and APIs | admin shell added
- 011 | P4 CV Builder | added dashboard, create CV, builder, preview routes | builder shell added
- 012 | P5 Export | added render transformer + export route | PDF pipeline wired
- 013 | P7 Polish and Hardening | fixed workspace typings + image lint warnings | validation pass in progress
- 014 | P7 Polish and Hardening | build blocked by missing Clerk env, added safe fallback | build pass continuing
- 015 | P6 Propagation | added item propagation API + choose-CV UI after create | new-item propagation live
- 016 | P1 Foundation | phase completed | workspace, auth shell, prisma, onboarding ready
- 017 | P2 Profile and Items | phase completed | profile/items CRUD pages + APIs ready
- 018 | P3 Template Admin | phase completed | admin template/user surfaces ready
- 019 | P4 CV Builder | phase completed | dashboard, create CV, builder, preview ready
- 020 | P5 Export | phase completed | render contract + export route ready
- 021 | P7 Polish and Hardening | ran `pnpm typecheck` `pnpm lint` `pnpm build` | all pass
- 022 | P6 Propagation | edit updates mark CVs pending, create flow can link into selected CVs | phase partly done
- 023 | P7 Polish and Hardening | phase completed | validation green, env-safe build fallback added
- 024 | P7 Polish and Hardening | preparing git release action | stage commit push next
- 025 | P1 Foundation | booted local postgres in `.local/postgres-data` | local DB server live
- 026 | P1 Foundation | created local `.env`, ran `db:push`, ran `db:seed` | app DB initialized
- 027 | P1 Foundation | started `pnpm dev` | app live on localhost:3000
- 028 | P7 Polish and Hardening | `.env.example` contained real secrets, replaced with placeholders | secret remediation started
- 029 | P1 Foundation | restarted app using local env export | run request handled
- 030 | P7 Polish and Hardening | turbo env pass-through missed Clerk/DB vars, added `globalEnv` | runtime fix
- 031 | P7 Polish and Hardening | fixed Clerk first-login profile race by replacing `upsert` with safe create/fetch | runtime fix
- 032 | P5 Export | moved `/cv/[id]/preview` out of app shell route group | preview now template-only
- 033 | P4 CV Builder | dashboard CV cards now use template preview image, not generic thumb | CV cards closer to real resume
- 034 | P5 Export | preview now points to `/api/export/[cvId]` PDF stream, not HTML page | preview opens PDF
- 035 | P4 CV Builder | added section-level bullet storage + rich bullet editor with formatting controls | section/item bullets upgraded
- 036 | P5 Export | updated starter template toward Overleaf ATS layout and reseeded template | template closer to target
- 037 | P4 CV Builder | replaced custom bullet editor with `react-quill-new` rich text editor | popular editor, per-bullet rich formatting live
- 038 | P4 CV Builder | extended CV item rows with heading/right-side/subheading/additional-info overrides | builder now supports Overleaf-style hierarchy
- 039 | P5 Export | updated render payload + template to print left/right rows before bullets | PDF closer to Overleaf structure
- 040 | P1 Foundation | pushed Prisma schema changes to Neon + regenerated client | runtime/client shape synced
- 041 | P4 CV Builder | fixed Quill format config after live browser warning | rich editor stable on CV page
- 042 | P7 Polish and Hardening | added `.codex/CONTEXT.md` handoff doc for next agent/thread | project context preserved
- 043 | P5 Export | refined seeded Handlebars resume template typography/spacing/hierarchy to match provided sample | PDF output now closer to target layout
- 044 | P5 Export | discovered admin starter template source diverged from DB seed and kept injecting old layout on manual edits | synced template source of truth
- 045 | P5 Export | rebuilt template CSS with explicit section/entry hierarchy and denser Overleaf-like spacing | layout fidelity improved for preview/export
- 046 | P4 CV Builder | removed full-page reload flow and switched builder to local section/item state updates after API writes | builder interactions now preserve UI state
- 047 | P5 Export | forced preview iframe cache-busting reload on successful builder writes | PDF preview now refreshes instantly after add/edit/remove/save
- 048 | P4 CV Builder | fixed hydration mismatch by rendering initial iframe src identical to server and applying cache-bust token only after client actions | no SSR/client attribute drift on first load
- 049 | P5 Export | rebuilt resume template with LaTeX-inspired proportions (Lato stack, small-caps section titles, tighter vertical rhythm) based on Overleaf source | closer visual parity with target template
- 050 | P4 CV Builder | expanded item creation form to capture hierarchy fields (subtitle, date range, location, bullets, URL) so PDF row structure can be populated from source data | hierarchy inputs now available at item level
- 051 | P4 CV Builder | added per-section "Add entry" form with full Overleaf hierarchy fields (heading/right/subheading/additional info/bullets/tech) and wired create+link flow | users can create structured entries directly inside section without leaving builder
- 052 | P4 CV Builder | simplified per-section entry form by promoting four hierarchy fields + bullets and moving type/tech into collapsible optional area | builder form less cluttered and easier to scan
- 053 | P5 Export | adjusted template indentation hierarchy: section title remains flush, heading/subheading rows get first-level indent, bullets get deeper indent | visual nesting now matches requested structure
- 054 | P5 Export | increased hierarchy indent to 6ch (head/subhead) and 12ch (bullets), plus added vertical breathing space between entries and bullet blocks | spacing now matches requested 6-space indent and extra vertical gap
- 055 | P5 Export | fixed overflow/wrapping by switching entry rows to grid with constrained right columns, enabling word-wrap, and preserving indent on wrapped lines | long content now breaks to new lines without margin collapse
- 056 | P5 Export | corrected section heading typography to match Overleaf look (normal case, reduced size, cleaner rule tone) | section names now render closer to reference
- 057 | P4 CV Builder | cleaned section form UX by flattening structure, surfacing only essential quick-add fields, and moving secondary controls into collapsible panels | reduced visual clutter and nesting depth
- 058 | P4 CV Builder | made builder forms collapsible (add section, quick add entry, section bullets, item edit) to reduce persistent UI noise | cleaner and more focus-oriented editing flow
- 059 | P5 Export | fixed Vercel preview/export Puppeteer runtime by adding `@sparticuz/chromium` + `puppeteer-core` launch path with Node runtime fallback for local dev | PDF preview/export now environment-compatible
- 060 | P7 Polish and Hardening | created `.codex/RULES.md` and added initial agent rule for auto-push to main after feature completion | project-level agent rulebook started
- 061 | P5 Export | fixed Next serverless externals for Vercel PDF stack (`puppeteer-core` + `@sparticuz/chromium`) and improved export error logging context | deploy/runtime failure diagnosis improved
- 062 | P5 Export | added stronger Chromium path checks and surfaced exact preview/export error details in API JSON response for production debugging | Vercel PDF failures now directly diagnosable from client response
- 063 | P5 Export | fixed Vercel file tracing for `@sparticuz/chromium` brotli assets by including chromium `bin/**` in Next output tracing and bundling package instead of externalizing | runtime can now locate Chromium binaries in serverless
- 064 | P5 Export | hardened Vercel chromium boot with explicit bin-dir probing + executablePath(binDir) fallback and broadened output tracing include scope | prevents pnpm path mismatch when locating brotli assets in lambda
- 065 | P5 Export | tightened template typography rhythm (smaller sizes, reduced line-height, reduced section/entry gaps, shallower indents) to better match Overleaf density and remove excess whitespace | PDF now visually denser and closer to target

## Completed phases
- P1 Foundation
- P2 Profile and Items
- P3 Template Admin
- P4 CV Builder
- P5 Export
- P7 Polish and Hardening
