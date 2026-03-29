import Link from "next/link";
import { ArrowRight, CheckCircle2, FolderKanban, Layers2, Sparkles } from "lucide-react";

const features = [
  {
    icon: Layers2,
    title: "Single source of truth",
    body: "Store each achievement once and reuse it across every resume variant without stale duplicates.",
  },
  {
    icon: FolderKanban,
    title: "Role-specific versions",
    body: "Create targeted resumes for backend, fullstack, internship, and academic roles from one profile.",
  },
  {
    icon: Sparkles,
    title: "Export-grade output",
    body: "Preview and export from production templates so your PDF stays consistent with your final submission.",
  },
];

const steps = [
  {
    title: "Build your master profile",
    body: "Capture projects, experience, education, and skills once with reusable structure.",
  },
  {
    title: "Compose each CV with intent",
    body: "Select only what matters for a role and customize hierarchy details per section.",
  },
  {
    title: "Preview and export confidently",
    body: "Use the same template pipeline for live preview and final PDF export.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <section className="panel overflow-hidden bg-[radial-gradient(circle_at_8%_12%,rgba(13,148,136,0.22),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.14),transparent_30%),linear-gradient(150deg,#f0fdfa,#f8fafc_44%,#eef2ff)] p-7 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="eyebrow">CVMake Platform</p>
            <h1 className="max-w-4xl text-[2.4rem] font-semibold tracking-tight text-slate-950 md:text-[3.8rem] md:leading-[1.04]">
              Build better resumes
              <br />
              without version chaos.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              A profile-first resume workspace for students and early professionals. Create multiple role-specific CVs while keeping every core achievement synchronized.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/sign-up">
                Start free
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link className="btn-secondary" href="/dashboard">
                Explore dashboard
              </Link>
            </div>
            <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                <CheckCircle2 className="size-4 text-teal-700" />
                One canonical item pool
              </p>
              <p className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                <CheckCircle2 className="size-4 text-teal-700" />
                Per-CV hierarchy overrides
              </p>
              <p className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                <CheckCircle2 className="size-4 text-teal-700" />
                Instant PDF preview
              </p>
              <p className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                <CheckCircle2 className="size-4 text-teal-700" />
                Template-controlled exports
              </p>
            </div>
          </div>

          <div className="panel-strong p-5">
            <p className="eyebrow">Workflow Snapshot</p>
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Step 1</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Capture master items</p>
                <p className="mt-1 text-sm text-slate-600">Projects, experience, skills, and education once.</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Step 2</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Compose role-specific CVs</p>
                <p className="mt-1 text-sm text-slate-600">Select entries per section and refine right-side hierarchy.</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-slate-950 to-slate-800 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.15em] text-cyan-300">Step 3</p>
                <p className="mt-1 text-sm font-semibold">Preview + export</p>
                <p className="mt-1 text-sm text-slate-300">Generate clean, template-driven PDFs ready for applications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="panel-strong rounded-[2rem] p-6">
              <div className="inline-flex rounded-xl bg-teal-50 p-2">
                <Icon className="size-6 text-teal-700" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
            </article>
          );
        })}
      </section>

      <section className="panel mt-8 rounded-[2rem] p-8">
        <div className="mb-6">
          <p className="eyebrow">How It Works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Three steps to a role-ready CV</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="panel-strong p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-700">Step {index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel mt-8 rounded-[2rem] p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Ready to start?</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Ship cleaner applications with less resume maintenance.
            </h2>
          </div>
          <Link className="btn-primary" href="/sign-in">
            Sign in
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
