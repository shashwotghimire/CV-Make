"use client";

import { useMemo, useState, useTransition } from "react";
import type { ItemType } from "@cvmake/types";

type PoolItem = {
  id: string;
  title: string;
  type: ItemType;
  tags: string[];
};

type SectionItem = {
  id: string;
  itemId: string;
  order: number;
  customBullets: string[];
  item: PoolItem;
};

type Section = {
  id: string;
  title: string;
  order: number;
  items: SectionItem[];
};

type BuilderProps = {
  cvId: string;
  sections: Section[];
  pool: PoolItem[];
  previewHref: string;
};

export function CVBuilder({ cvId, sections, pool, previewHref }: BuilderProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sectionTitle, setSectionTitle] = useState("");

  const filteredPool = useMemo(() => {
    if (typeFilter === "ALL") return pool;
    return pool.filter((item) => item.type === typeFilter);
  }, [pool, typeFilter]);

  async function createSection() {
    if (!sectionTitle.trim()) return;

    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: sectionTitle, order: sections.length }),
      });

      if (!response.ok) {
        setMessage("Section create failed.");
        return;
      }

      window.location.reload();
    });
  }

  async function addItem(sectionId: string, itemId: string, order: number) {
    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections/${sectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, order, customBullets: [] }),
      });

      if (!response.ok) {
        setMessage("Item link failed.");
        return;
      }

      window.location.reload();
    });
  }

  async function updateBullets(sectionId: string, itemLinkId: string, bulletsRaw: string) {
    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections/${sectionId}/items/${itemLinkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customBullets: bulletsRaw
            .split("\n")
            .map((entry) => entry.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        setMessage("Custom bullets failed.");
        return;
      }

      setMessage("Custom bullets saved.");
      window.location.reload();
    });
  }

  async function removeItem(sectionId: string, itemLinkId: string) {
    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections/${sectionId}/items/${itemLinkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage("Remove failed.");
        return;
      }

      window.location.reload();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px,1fr,360px]">
      <aside className="rounded-3xl border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-950">Master profile pool</p>
            <p className="text-sm text-slate-600">Filter items before adding them to sections.</p>
          </div>
          <select className="input-base max-w-32" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PROJECT">Project</option>
            <option value="EXPERIENCE">Experience</option>
            <option value="EDUCATION">Education</option>
            <option value="SKILL">Skill</option>
            <option value="CERTIFICATION">Cert</option>
          </select>
        </div>
        <div className="mt-4 space-y-3">
          {filteredPool.map((item) => (
            <div key={item.id} className="rounded-2xl border border-black/10 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{item.type}</p>
              <h3 className="mt-2 font-semibold text-slate-950">{item.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    className="rounded-full border border-black/10 px-3 py-2 text-xs"
                    disabled={pending}
                    onClick={() => addItem(section.id, item.id, section.items.length)}
                    type="button"
                  >
                    Add to {section.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        <div className="rounded-3xl border border-black/10 bg-white p-5">
          <div className="flex gap-3">
            <input
              className="input-base"
              onChange={(event) => setSectionTitle(event.target.value)}
              placeholder="Add section"
              value={sectionTitle}
            />
            <button className="btn-primary" disabled={pending} onClick={createSection} type="button">
              New section
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
        </div>

        {sections.map((section) => (
          <article key={section.id} className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Section {section.order + 1}
                </p>
                <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900">
                {section.items.length} items
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {section.items.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-black/10 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                        {entry.item.type}
                      </p>
                      <h3 className="mt-2 font-semibold text-slate-950">{entry.item.title}</h3>
                    </div>
                    <button className="btn-secondary" onClick={() => removeItem(section.id, entry.id)} type="button">
                      Remove
                    </button>
                  </div>
                  <label className="mt-4 block">
                    <span className="label-text">Custom bullets</span>
                    <textarea
                      className="input-base min-h-28"
                      defaultValue={entry.customBullets.join("\n")}
                      onBlur={(event) => updateBullets(section.id, entry.id, event.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <aside className="rounded-3xl border border-black/10 bg-white p-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-950">Preview</p>
          <p className="text-sm text-slate-600">Uses the same render transformer planned for export.</p>
        </div>
        <iframe className="mt-4 h-[720px] w-full rounded-2xl border border-black/10" src={previewHref} title="CV preview" />
      </aside>
    </div>
  );
}
