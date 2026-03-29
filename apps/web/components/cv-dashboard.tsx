"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

type CVCard = {
  id: string;
  name: string;
  updatedAt: string;
  hasPendingUpdates: boolean;
  template: {
    name: string;
    imageUrl: string;
  };
};

export function CVDashboard({ cvs }: { cvs: CVCard[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function deleteCV(id: string) {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch(`/api/cvs/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setMessage("Delete failed.");
        return;
      }
      setMessage("CV deleted.");
      window.location.reload();
    });
  }

  async function duplicateCV(id: string) {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch(`/api/cvs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duplicate: true }),
      });
      if (!response.ok) {
        setMessage("Duplicate failed.");
        return;
      }
      setMessage("CV duplicated.");
      window.location.reload();
    });
  }

  if (!cvs.length) {
    return (
      <div className="panel rounded-3xl border-dashed border-black/20 p-8">
        <h2 className="text-xl font-semibold text-slate-950">No CVs yet</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Start with a template, then pull sections and items from your master profile.
        </p>
        <Link className="btn-primary mt-5" href="/cv/new">
          Create your first CV
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message ? <p className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-slate-600">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cvs.map((cv) => (
          <article key={cv.id} className="panel-strong overflow-hidden rounded-3xl">
            {cv.template.imageUrl ? (
              <Image
                alt={cv.name}
                className="h-40 w-full object-cover object-top"
                height={320}
                src={cv.template.imageUrl}
                unoptimized
                width={640}
              />
            ) : (
              <div className="flex h-40 w-full items-end bg-[linear-gradient(140deg,#ecfeff,#ffffff_55%,#f3f4f6)] p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                    {cv.template.name}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">Template preview image missing</p>
                </div>
              </div>
            )}
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{cv.name}</h3>
                  <p className="text-sm text-slate-600">{cv.template.name}</p>
                </div>
                {cv.hasPendingUpdates ? (
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-900">
                    Updated pool
                  </span>
                ) : null}
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Last touch {new Date(cv.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link className="btn-primary" href={`/cv/${cv.id}`}>
                  Edit
                </Link>
                <Link className="btn-secondary" href={`/api/export/${cv.id}`} target="_blank">
                  Preview
                </Link>
                <button className="btn-secondary" disabled={pending} onClick={() => duplicateCV(cv.id)} type="button">
                  Duplicate
                </button>
                <button className="btn-secondary" disabled={pending} onClick={() => deleteCV(cv.id)} type="button">
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
