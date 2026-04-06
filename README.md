# CV-Make

A full-stack CV / résumé builder. Create a profile, add your experience, projects, education, and skills, then compose polished CVs from reusable items and export them as PDFs.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Auth | Clerk |
| Database | PostgreSQL via Prisma |
| File storage | Cloudinary |
| PDF export | Puppeteer + `@sparticuz/chromium` |
| Monorepo | Turborepo + pnpm workspaces |

## Project structure

```
apps/
  web/          # Next.js application
packages/
  db/           # Prisma schema & client (@cvmake/db)
  types/        # Shared TypeScript types (@cvmake/types)
  ui/           # Shared React components (@cvmake/ui)
```

## Getting started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 10
- A PostgreSQL database
- Clerk, and Cloudinary accounts

### Setup

1. Clone and install dependencies:

```bash
git clone https://github.com/shashwotghimire/CV-Make.git
cd CV-Make
pnpm install
```

2. Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

3. Push the database schema:

```bash
pnpm db:push
```

4. Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Available scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema changes without migrations |
| `pnpm db:seed` | Seed the database |
