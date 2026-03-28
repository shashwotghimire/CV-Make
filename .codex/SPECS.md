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

## Completed phases
- P1 Foundation
- P2 Profile and Items
- P3 Template Admin
- P4 CV Builder
- P5 Export
- P7 Polish and Hardening
