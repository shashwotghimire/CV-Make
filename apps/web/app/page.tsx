import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, FolderKanban, Layers2, Sparkles } from "lucide-react";

const features = [
  {
    icon: Layers2,
    title: "Single source of truth",
    body: "Store each achievement once and reuse it across every resume variant — no more stale duplicates.",
    gradient: "from-teal-500/10 to-cyan-500/5",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-700",
  },
  {
    icon: FolderKanban,
    title: "Role-specific versions",
    body: "Create targeted resumes for backend, fullstack, internship, and academic roles from one profile.",
    gradient: "from-violet-500/10 to-indigo-500/5",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-700",
  },
  {
    icon: Sparkles,
    title: "Export-grade output",
    body: "Preview and export from production templates so your PDF stays consistent with your final submission.",
    gradient: "from-amber-500/10 to-orange-500/5",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
];

const steps = [
  {
    step: "01",
    title: "Build your master profile",
    body: "Capture projects, experience, education, and skills once with reusable structure.",
    detail: "Never re-type the same achievement again",
  },
  {
    step: "02",
    title: "Compose each CV with intent",
    body: "Select only what matters for a role and customize hierarchy details per section.",
    detail: "Tailored resumes in minutes, not hours",
  },
  {
    step: "03",
    title: "Preview and export confidently",
    body: "Use the same template pipeline for live preview and final PDF export.",
    detail: "Pixel-perfect PDFs every time",
  },
];

const stats = [
  { value: "1", suffix: "×", label: "Master profile" },
  { value: "∞", suffix: "", label: "CV variants" },
  { value: "0", suffix: "×", label: "Duplicate effort" },
  { value: "100", suffix: "%", label: "Template-driven" },
];

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      {/* ── Sticky Navbar ─────────────────────────────────────── */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
              <FileText className="size-4 text-white" />
            </div>
            <span className="font-semibold text-white">CVMake</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:block">
              Sign in
            </Link>
            <Link href="/sign-up" className="btn-primary !px-4 !py-2 !text-sm">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-slate-950 pt-20">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
        <div className="hero-grid" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="text-center">
            <div className="landing-fade-in" style={{ animationDelay: "0ms" }}>
              <span className="eyebrow-dark">CVMake · Free to start</span>
            </div>

            <h1
              className="landing-fade-in mx-auto mt-6 max-w-5xl text-[3rem] font-bold tracking-tight text-white md:text-[5.5rem] md:leading-[0.95]"
              style={{ animationDelay: "80ms" }}
            >
              One profile.
              <br />
              <span className="hero-gradient-text">Every resume.</span>
            </h1>

            <p
              className="landing-fade-in mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400"
              style={{ animationDelay: "160ms" }}
            >
              A profile-first resume workspace for students and early professionals. Maintain one
              master CV, then compose role-specific versions without duplicating a single line.
            </p>

            <div
              className="landing-fade-in mt-10 flex flex-wrap items-center justify-center gap-4"
              style={{ animationDelay: "240ms" }}
            >
              <Link className="btn-primary-lg" href="/sign-up">
                Start for free
                <ArrowRight className="ml-2 size-5" />
              </Link>
              <Link className="btn-ghost-lg" href="/dashboard">
                View dashboard →
              </Link>
            </div>

            <div
              className="landing-fade-in mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
              style={{ animationDelay: "320ms" }}
            >
              {["No credit card required", "Free forever plan", "Export to PDF"].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-teal-500" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* App mockup */}
          <div className="landing-fade-in mt-16 md:mt-24" style={{ animationDelay: "400ms" }}>
            <div className="hero-mockup-frame">
              <div className="mockup-titlebar">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <div className="mockup-url-bar">cvmake.app/dashboard</div>
                <div className="w-16" />
              </div>
              <div className="mockup-content">
                <div className="mockup-sidebar">
                  {["Dashboard", "My CVs", "Profile", "Templates"].map((item, i) => (
                    <div key={item} className={`mockup-nav-item ${i === 0 ? "active" : ""}`}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mockup-main">
                  <div className="mockup-header">
                    <div className="mockup-title-block" />
                    <div className="mockup-btn-block" />
                  </div>
                  <div className="mockup-cards">
                    <div className="mockup-card highlight">
                      <div className="mockup-card-tag" />
                      <div className="mockup-card-line w-3/4" />
                      <div className="mockup-card-line mt-1.5 w-1/2" />
                    </div>
                    <div className="mockup-card">
                      <div className="mockup-card-tag secondary" />
                      <div className="mockup-card-line w-2/3" />
                      <div className="mockup-card-line mt-1.5 w-1/3" />
                    </div>
                    <div className="mockup-card">
                      <div className="mockup-card-tag secondary" />
                      <div className="mockup-card-line w-4/5" />
                      <div className="mockup-card-line mt-1.5 w-2/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900 py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-white">
                  {s.value}
                  <span className="text-teal-400">{s.suffix}</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Light content ─────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-slate-50 to-white">
        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="text-center">
            <p className="eyebrow">Why CVMake</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Built for the modern job hunt
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Stop managing a dozen slightly different copies of your resume. One profile powers
              every application.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`feature-card bg-gradient-to-br ${feature.gradient}`}
                >
                  <div className={`feature-icon-wrap ${feature.iconBg}`}>
                    <Icon className={`size-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-100 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center">
              <p className="eyebrow">How It Works</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Three steps to role-ready
              </h2>
            </div>

            <div className="relative mt-16 grid gap-8 md:grid-cols-3">
              <div className="steps-connector hidden md:block" />
              {steps.map((step) => (
                <div key={step.step} className="step-card">
                  <div className="step-number">{step.step}</div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
                  <p className="mt-4 text-xs font-semibold text-teal-700">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem vs Solution */}
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow">The difference</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Chaos vs. clarity
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="problem-card">
              <p className="text-xs font-bold uppercase tracking-widest text-red-500">The Old Way</p>
              <h3 className="mt-3 text-2xl font-bold text-slate-950">Resume chaos</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "resume_v2_final.pdf",
                  "resume_backend_june.pdf",
                  "CV_internship_NEW.pdf",
                  "resume_FINAL_v3_USE_THIS.pdf",
                ].map((name) => (
                  <li key={name} className="old-way-item">
                    <FileText className="size-4 flex-shrink-0 text-slate-400" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-slate-500">
                Hours wasted maintaining slightly different versions, forgetting which is current,
                and missing updates across files.
              </p>
            </div>

            <div className="solution-card">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">
                The CVMake Way
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-950">Organized clarity</h3>
              <ul className="mt-5 space-y-3">
                {[
                  { name: "Master Profile", tag: "Always current", highlight: true },
                  { name: "Backend Engineer CV", tag: "Derived", highlight: false },
                  { name: "Fullstack Intern CV", tag: "Derived", highlight: false },
                  { name: "Research Assistant CV", tag: "Derived", highlight: false },
                ].map((item) => (
                  <li key={item.name} className={`new-way-item ${item.highlight ? "highlight" : ""}`}>
                    <CheckCircle2
                      className={`size-4 flex-shrink-0 ${item.highlight ? "text-teal-600" : "text-slate-400"}`}
                    />
                    <span
                      className={`text-sm ${item.highlight ? "font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.highlight ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {item.tag}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-slate-600">
                One update to your master profile flows into every CV instantly. Zero duplication,
                total clarity.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-blob-1" />
          <div className="cta-blob-2" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center md:px-6">
            <span className="eyebrow-dark">Ready to simplify?</span>
            <h2 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
              Ship smarter,
              <br />
              apply faster.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
              Join students and early-career professionals who&apos;ve ditched resume version chaos
              for good.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/sign-up" className="btn-primary-lg">
                Create free account
                <ArrowRight className="ml-2 size-5" />
              </Link>
              <Link href="/sign-in" className="btn-ghost-lg">
                Already have an account →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-100 bg-white py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                <FileText className="size-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700">CVMake</span>
            </div>
            <p className="text-xs text-slate-400">Built for students and early professionals.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
