"use client";

import { useState, useTransition } from "react";
import type { ItemType } from "@cvmake/types";

type ItemRecord = {
  id: string;
  type: ItemType;
  title: string;
  subtitle: string | null;
  description: string | null;
  dateStart: string | null;
  dateEnd: string | null;
  url: string | null;
  location: string | null;
  bullets: string[];
  tags: string[];
  technologies: string[];
};

type CVOption = {
  id: string;
  name: string;
};

export function ItemsManager({
  items,
  cvOptions,
}: {
  items: ItemRecord[];
  cvOptions: CVOption[];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [propagationItemId, setPropagationItemId] = useState<string | null>(null);
  const [selectedCVIds, setSelectedCVIds] = useState<string[]>([]);

  const filteredItems =
    typeFilter === "ALL" ? items : items.filter((item) => item.type === typeFilter);

  function parseBullets(value: string) {
    return value
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  async function handleCreate(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const payload = {
        type: formData.get("type"),
        title: formData.get("title"),
        subtitle: formData.get("subtitle") || null,
        description: formData.get("description") || null,
        bullets: parseBullets(String(formData.get("bullets") ?? "")),
        technologies: String(formData.get("technologies") ?? "")
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
        tags: String(formData.get("tags") ?? "")
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
        dateStart: formData.get("dateStart") || null,
        dateEnd: formData.get("dateEnd") || null,
        url: formData.get("url") || null,
        meta: {
          ...(formData.get("location")
            ? { location: String(formData.get("location")) }
            : {}),
        },
      };

      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setMessage("Create failed.");
        return;
      }

      const created = (await response.json()) as {
        id: string;
        propagationOptions: CVOption[];
      };

      if (created.propagationOptions.length) {
        setPropagationItemId(created.id);
        setSelectedCVIds(created.propagationOptions.map((entry) => entry.id));
        setMessage("Item created. Choose CVs to propagate it.");
        return;
      }

      setMessage("Item created.");
      window.location.reload();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setMessage("Delete failed.");
        return;
      }

      setMessage("Item removed.");
      window.location.reload();
    });
  }

  async function propagateToSelected() {
    if (!propagationItemId || !selectedCVIds.length) {
      setMessage("Select at least one CV or skip.");
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/items/${propagationItemId}/propagate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvIds: selectedCVIds }),
      });

      if (!response.ok) {
        setMessage("Propagation failed.");
        return;
      }

      setMessage("Item propagated.");
      window.location.reload();
    });
  }

  function toggleCV(cvId: string) {
    setSelectedCVIds((current) =>
      current.includes(cvId) ? current.filter((entry) => entry !== cvId) : [...current, cvId],
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
      <form action={handleCreate} className="panel-strong p-5">
        <h2 className="text-lg font-semibold text-slate-950">Add item</h2>
        <div className="mt-4 space-y-3">
          <label className="form-field">
            <span className="label-text">Type</span>
            <select className="input-base" name="type" defaultValue="PROJECT">
              <option value="PROJECT">Project</option>
              <option value="EXPERIENCE">Experience</option>
              <option value="EDUCATION">Education</option>
              <option value="SKILL">Skill</option>
              <option value="CERTIFICATION">Certification</option>
            </select>
          </label>
          <label className="form-field">
            <span className="label-text">Title</span>
            <input className="input-base" name="title" required />
          </label>
          <label className="form-field">
            <span className="label-text">Subheading</span>
            <input className="input-base" name="subtitle" placeholder="Software Engineer / B.S. Computer Science" />
          </label>
          <div className="form-grid">
            <label className="form-field">
              <span className="label-text">Start date</span>
              <input className="input-base" name="dateStart" type="month" />
            </label>
            <label className="form-field">
              <span className="label-text">End date</span>
              <input className="input-base" name="dateEnd" type="month" />
            </label>
          </div>
          <label className="form-field">
            <span className="label-text">Right-side info (location)</span>
            <input className="input-base" name="location" placeholder="City, State" />
          </label>
          <label className="form-field">
            <span className="label-text">Description</span>
            <textarea className="input-base min-h-28" name="description" />
          </label>
          <label className="form-field">
            <span className="label-text">Bullets (one per line)</span>
            <textarea className="input-base min-h-28" name="bullets" placeholder="Built X that improved Y\nLed Z and reduced A" />
          </label>
          <label className="form-field">
            <span className="label-text">URL</span>
            <input className="input-base" name="url" placeholder="https://example.com" type="url" />
          </label>
          <label className="form-field">
            <span className="label-text">Technologies</span>
            <input className="input-base" name="technologies" placeholder="Next.js, Prisma, Clerk" />
          </label>
          <label className="form-field">
            <span className="label-text">Tags</span>
            <input className="input-base" name="tags" placeholder="frontend, featured" />
          </label>
          <button className="btn-primary w-full" disabled={pending} type="submit">
            {pending ? "Saving..." : "Create item"}
          </button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </form>

      <div className="space-y-4">
        {propagationItemId ? (
          <div className="panel-strong border-teal-300 bg-teal-50/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Propagation prompt
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              Add this new item to existing CVs
            </h2>
            <div className="mt-4 grid gap-2">
              {cvOptions.map((cv) => (
                <label key={cv.id} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <input
                    checked={selectedCVIds.includes(cv.id)}
                    onChange={() => toggleCV(cv.id)}
                    type="checkbox"
                  />
                  <span className="text-sm text-slate-700">{cv.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button className="btn-primary" disabled={pending} onClick={propagateToSelected} type="button">
                Add to selected CVs
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setPropagationItemId(null);
                  setMessage("Propagation skipped.");
                  window.location.reload();
                }}
                type="button"
              >
                Skip
              </button>
            </div>
          </div>
        ) : null}
        <div className="panel-strong flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium text-slate-950">Master item pool</p>
            <p className="text-sm text-slate-600">Filter by item type. Tags stay visible on each card.</p>
          </div>
          <select
            className="input-base max-w-44"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PROJECT">Project</option>
            <option value="EXPERIENCE">Experience</option>
            <option value="EDUCATION">Education</option>
            <option value="SKILL">Skill</option>
            <option value="CERTIFICATION">Certification</option>
          </select>
        </div>
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <article key={item.id} className="panel-strong p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                    {item.type}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  {item.subtitle ? <p className="text-sm italic text-slate-700">{item.subtitle}</p> : null}
                  {(item.dateStart || item.dateEnd || item.location) ? (
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                      {item.dateStart || item.dateEnd
                        ? `${item.dateStart ? new Date(item.dateStart).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : ""}${item.dateStart || item.dateEnd ? " - " : ""}${item.dateEnd ? new Date(item.dateEnd).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "Present"}`
                        : ""}
                      {item.location ? `${item.dateStart || item.dateEnd ? " | " : ""}${item.location}` : ""}
                    </p>
                  ) : null}
                  <p className="text-sm text-slate-600">{item.description}</p>
                  {item.bullets.length ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {item.bullets.slice(0, 2).map((bullet, index) => (
                        <li key={`${item.id}-bullet-${index}`}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                    {item.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-teal-100 px-3 py-1 text-xs text-teal-900">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="btn-secondary" onClick={() => handleDelete(item.id)} type="button">
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!filteredItems.length ? (
            <div className="panel rounded-3xl border-dashed border-black/20 p-8 text-sm text-slate-500">
              No items in this filter yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
