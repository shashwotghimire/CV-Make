import Link from "next/link";
import { ArrowRight, FolderKanban, Layers2, Sparkles } from "lucide-react";

const features = [
  {
    icon: Layers2,
    title: "Master profile first",
    body: "Store every project, skill, education entry, and experience once. Stop copying the same lines across files.",
  },
  {
    icon: FolderKanban,
    title: "Multiple role-specific CVs",
    body: "Build a backend CV, internship CV, and academic CV from the same content pool with custom sections.",
  },
  {
    icon: Sparkles,
    title: "Template-led output",
    body: "Admin-uploaded templates keep exports clean, reusable, and consistent across every generated PDF.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <section className="panel overflow-hidden bg-[radial-gradient(circle_at_10%_15%,rgba(13,148,136,0.2),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.16),transparent_26%),linear-gradient(150deg,#f0fdfa,#f8fafc_44%,#eef2ff)] p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-end">
          <div className="space-y-6">
            <p className="eyebrow">CVMake 2026</p>
            <h1 className="max-w-4xl text-[2.7rem] font-semibold tracking-tight text-slate-950 md:text-[4rem] md:leading-[1.02]">
              One structured profile.
              <br />
              Many tailored resumes.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Build role-specific CVs without copy-paste drift. Centralize your items, customize per-CV hierarchy, and preview export-grade output instantly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/sign-up">
                Get started
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link className="btn-secondary" href="/dashboard">
                Open dashboard
              </Link>
            </div>
            <div className="grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Source</p>
                <p className="text-sm font-semibold text-slate-900">Master Items</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Build</p>
                <p className="text-sm font-semibold text-slate-900">CV Variants</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Export</p>
                <p className="text-sm font-semibold text-slate-900">PDF Ready</p>
              </div>
            </div>
          </div>
          <div className="panel-strong p-6">
            <div className="space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Live editing flow</p>
                <h2 className="mt-2 text-2xl font-semibold">Profile → Builder → Preview</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Keep one source of truth and customize only what each target role needs.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Workflow strength</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">Section hierarchy controls + reusable item pool</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Speed</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">Instant preview refresh after edits</p>
                </div>
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Phase guide</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Foundation, profile, templates, builder, export, propagation.
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
