import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-black/10 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
            CVMake
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-black/10 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)]",
        className,
      )}
      {...props}
    />
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex min-h-56 flex-col items-start justify-center gap-4 bg-[linear-gradient(135deg,#fff7ed,#ffffff)]">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="max-w-xl text-sm leading-6 text-slate-600">{body}</p>
      {action}
    </Card>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
