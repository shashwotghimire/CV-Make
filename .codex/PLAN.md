# CVMake Build and Documentation Plan

## Summary
Build CVMake in phased delivery inside a Turborepo, and treat `.codex/PLAN.md` + `.codex/SPECS.md` as required project artifacts from day 0. `PLAN.md` is the build contract. `SPECS.md` is the running action log: every meaningful agent action must be appended concisely, tagged with the relevant phase from `PLAN.md`, and each phase completion must be explicitly logged.

## Key Changes
### Documentation contract
- Create `.codex/PLAN.md` with the phased build plan before app work starts.
- Create `.codex/SPECS.md` immediately after `PLAN.md`.
- `SPECS.md` entry format stays terse and action-first:
  - timestamp or sequence marker
  - phase label like `P1 Foundation`
  - action taken
  - short outcome/status
- Log rules:
  - every repo mutation by the agent gets a short entry
  - every meaningful non-trivial decision gets a short entry
  - when a phase is done, add a dedicated `Phase completed` entry
  - grammar can be compressed for speed and density
- Recommended structure in `SPECS.md`:
  - `Current phase`
  - `Action log`
  - `Completed phases`

### Phase 1 — Foundation
- Initialize Turborepo with `apps/web`, `packages/db`, `packages/ui`, `packages/types`.
- Set up Next.js 14 App Router, TypeScript, Tailwind, shared config, env validation.
- Configure Clerk auth, middleware protection, server helpers.
- Add Prisma schema for `Profile`, `Item`, `CV`, `CVSection`, `CVSectionItem`, `Template`, enums.
- Implement onboarding:
  - signed-in user upserts profile by `clerkUserId`
  - incomplete extended profile redirects to `/onboarding`
- Log in `SPECS.md`:
  - repo bootstrap
  - package creation
  - auth wiring
  - schema creation
  - onboarding complete
  - `P1 completed`

### Phase 2 — Profile and Items
- Build `/profile` for DB-owned extended profile fields.
- Build `/profile/items` for CRUD and filterable item pool.
- Use one item model with shared base fields and typed JSON payload per `ItemType`.
- Add API routes for profile and items.
- Ownership-check every read/write route against current Clerk user.
- Log in `SPECS.md`:
  - profile page/API
  - item schema/validation
  - CRUD completion
  - filters added
  - `P2 completed`

### Phase 3 — Template Admin
- Add admin-only route and API guards using DB role.
- Build `/admin/templates` list/create/edit/activate/deactivate.
- Upload thumbnail and preview assets to Cloudinary.
- Store Handlebars template HTML in DB.
- Add usage count derived from linked CV count.
- Log in `SPECS.md`:
  - role guard added
  - template CRUD added
  - Cloudinary integration added
  - `P3 completed`

### Phase 4 — CV Builder
- Build `/dashboard` with empty state and CV cards.
- Add CV CRUD including duplicate/delete.
- Build `/cv/new` and `/cv/[id]` builder.
- Builder supports:
  - pool filtering by type/tag
  - section create/delete/reorder
  - add/remove item to section
  - reorder items in section
  - custom bullet overrides
  - live preview using normalized render payload
- Add CV and section/item linking APIs.
- Log in `SPECS.md`:
  - dashboard
  - builder shell
  - DnD ordering
  - custom bullets
  - preview wiring
  - `P4 completed`

### Phase 5 — Export
- Build render transformer from DB entities to stable template payload.
- Add `/cv/[id]/preview` using same payload as export.
- Add `POST /api/export/[cvId]`:
  - fetch CV graph
  - render Handlebars HTML
  - generate PDF with Puppeteer
  - upload PDF to Cloudinary
  - return signed URL
- Add failure logging around render/upload/export.
- Log in `SPECS.md`:
  - render contract added
  - preview route done
  - PDF export done
  - signed URL flow done
  - `P5 completed`

### Phase 6 — Propagation
- Add propagation prompt flow for item create/edit.
- On create:
  - offer `Add to all`, `Choose CVs`, `Skip`
  - allow per-CV target section selection or inline section creation
- On edit:
  - detect linked CVs
  - offer `Update all`, `Choose`, `Skip`
  - preserve custom bullets by default
  - overwrite only on explicit opt-in
- Add `hasPendingUpdates` or equivalent freshness marker on CV.
- Reflect pending state on dashboard cards.
- Log in `SPECS.md`:
  - create propagation
  - edit propagation
  - freshness tracking
  - `P6 completed`

### Phase 7 — Polish and Hardening
- Add empty states, loading states, clear error states.
- Harden authorization and ownership checks across all routes.
- Improve responsive behavior, especially dashboard/profile/admin screens.
- Add dev seed for admin user and starter template.
- Add targeted test coverage and smoke checks.
- Log in `SPECS.md`:
  - polish pass
  - auth hardening
  - seed added
  - final QA pass
  - `P7 completed`

## Public Interfaces and Types
- App routes:
  - `/`, `/sign-in`, `/sign-up`, `/onboarding`, `/dashboard`, `/profile`, `/profile/items`, `/cv/new`, `/cv/[id]`, `/cv/[id]/preview`, `/admin`, `/admin/templates`, `/admin/users`
- API routes:
  - `GET/PUT /api/profile`
  - `GET/POST /api/items`
  - `PUT/DELETE /api/items/[id]`
  - `GET/POST /api/cvs`
  - `GET/PUT/DELETE /api/cvs/[id]`
  - `POST /api/cvs/[id]/sections`
  - `PUT/DELETE /api/cvs/[id]/sections/[sid]`
  - `POST /api/cvs/[id]/sections/[sid]/items`
  - `PUT/DELETE /api/cvs/[id]/sections/[sid]/items/[iid]`
  - `POST /api/export/[cvId]`
  - `GET/POST /api/admin/templates`
  - `PUT/DELETE /api/admin/templates/[id]`
  - `GET /api/admin/users`
- Shared type decisions:
  - Clerk identity stays external
  - DB owns role, profile, items, CVs, templates
  - item-specific extra fields live in typed JSON payload validated per `ItemType`
  - template rendering uses normalized DTO, never raw Prisma entity

## Test Plan
- Foundation:
  - auth works
  - onboarding redirect works
  - onboarding save reaches dashboard
- Profile/items:
  - all item types create/edit/delete
  - filters work
  - cross-user access blocked
- Templates/admin:
  - non-admin denied
  - admin can manage templates and activation state
- CV builder:
  - create CV
  - reorder sections/items
  - custom bullets persist
  - duplicate CV stays independent
- Export:
  - preview matches export content
  - custom bullets override master bullets
  - signed PDF URL works
- Propagation:
  - create flow links selected CVs only
  - edit flow preserves custom bullets by default
  - overwrite only when explicitly selected
- Documentation:
  - every phase includes matching `SPECS.md` entries
  - each completed phase has explicit completion log line

## Assumptions
- Repo is currently minimal, so `.codex/PLAN.md` and `.codex/SPECS.md` are created as first implementation artifacts.
- `SPECS.md` is concise by design; short fragmented grammar is acceptable.
- One app only in V0; no separate worker or background queue.
- PDF generation remains synchronous in request cycle for V0.
- Admin assignment is manual via DB/seed until a later phase adds management UI.
