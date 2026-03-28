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
      <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(135deg,#fffdf6,#f5efe2)] p-8 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.6)] md:p-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              CVMake v0
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Build every CV from one career source of truth.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              CVMake keeps your projects, experiences, skills, and education in one master profile so tailored resumes stop drifting out of sync.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/sign-up">
                Get started
              </Link>
              <Link className="btn-secondary" href="/dashboard">
                Open dashboard
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 backdrop-blur">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Live flow</p>
                <h2 className="mt-2 text-2xl font-semibold">Profile → CV Builder → PDF</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Update a project once. Push it into the right CVs. Keep bullet overrides where needed.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-sm font-medium text-slate-950">Role tags</p>
                  <p className="mt-1 text-sm text-slate-600">frontend, backend, fullstack, academic, internship</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-sm font-medium text-slate-950">Status tags</p>
                  <p className="mt-1 text-sm text-slate-600">featured, recent, archived</p>
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
            <article key={feature.title} className="rounded-[2rem] border border-black/10 bg-white/85 p-6">
              <Icon className="size-6 text-amber-700" />
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-[2rem] border border-black/10 bg-white/85 p-8">
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
