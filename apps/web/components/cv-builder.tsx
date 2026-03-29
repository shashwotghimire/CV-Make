"use client";

import { useMemo, useState, useTransition } from "react";
import type { ItemType } from "@cvmake/types";
import { RichBulletEditor } from "@/components/rich-bullet-editor";

type PoolItem = {
  id: string;
  title: string;
  subtitle: string | null;
  type: ItemType;
  tags: string[];
  technologies: string[];
  dateStart: string | null;
  dateEnd: string | null;
  url: string | null;
  meta: Record<string, unknown>;
};

type SectionItem = {
  id: string;
  itemId: string;
  order: number;
  customTitle: string | null;
  customSubtitle: string | null;
  customRightTitle: string | null;
  customRightSubtitle: string | null;
  customBullets: string[];
  item: PoolItem;
};

type Section = {
  id: string;
  title: string;
  order: number;
  summaryBullets: string[];
  items: SectionItem[];
};

type BuilderProps = {
  cvId: string;
  sections: Section[];
  pool: PoolItem[];
  previewHref: string;
};

type EntryDraft = {
  customTitle: string;
  customSubtitle: string;
  customRightTitle: string;
  customRightSubtitle: string;
};

type SectionEntryDraft = {
  type: ItemType;
  title: string;
  subtitle: string;
  rightTitle: string;
  rightSubtitle: string;
  bulletsText: string;
  technologiesText: string;
};

export function CVBuilder({ cvId, sections, pool, previewHref }: BuilderProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sectionTitle, setSectionTitle] = useState("");
  const [cvSections, setCvSections] = useState(sections);
  const [previewReloadToken, setPreviewReloadToken] = useState<string | null>(null);
  const [entryDrafts, setEntryDrafts] = useState<Record<string, EntryDraft>>({});
  const [sectionEntryDrafts, setSectionEntryDrafts] = useState<Record<string, SectionEntryDraft>>({});

  function refreshPreview() {
    setPreviewReloadToken(`${Date.now()}`);
  }

  function getSectionEntryDraft(section: Section): SectionEntryDraft {
    return (
      sectionEntryDrafts[section.id] ?? {
        type: inferItemTypeFromSection(section.title),
        title: "",
        subtitle: "",
        rightTitle: "",
        rightSubtitle: "",
        bulletsText: "",
        technologiesText: "",
      }
    );
  }

  function updateSectionEntryDraft(section: Section, patch: Partial<SectionEntryDraft>) {
    setSectionEntryDrafts((current) => ({
      ...current,
      [section.id]: {
        ...getSectionEntryDraft(section),
        ...patch,
      },
    }));
  }

  function resetSectionEntryDraft(section: Section) {
    setSectionEntryDrafts((current) => ({
      ...current,
      [section.id]: {
        type: inferItemTypeFromSection(section.title),
        title: "",
        subtitle: "",
        rightTitle: "",
        rightSubtitle: "",
        bulletsText: "",
        technologiesText: "",
      },
    }));
  }

  const filteredPool = useMemo(() => {
    if (typeFilter === "ALL") return pool;
    return pool.filter((item) => item.type === typeFilter);
  }, [pool, typeFilter]);

  function getDefaultDraft(item: PoolItem, entry?: SectionItem): EntryDraft {
    return {
      customTitle: entry?.customTitle ?? item.title ?? "",
      customSubtitle: entry?.customSubtitle ?? item.subtitle ?? "",
      customRightTitle: entry?.customRightTitle ?? formatRightTitle(item),
      customRightSubtitle: entry?.customRightSubtitle ?? formatRightSubtitle(item),
    };
  }

  function getDraft(entry: SectionItem) {
    return entryDrafts[entry.id] ?? getDefaultDraft(entry.item, entry);
  }

  function updateDraft(entry: SectionItem, patch: Partial<EntryDraft>) {
    setEntryDrafts((current) => ({
      ...current,
      [entry.id]: {
        ...getDraft(entry),
        ...patch,
      },
    }));
  }

  async function createSection() {
    if (!sectionTitle.trim()) return;

    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sectionTitle,
          order: cvSections.length,
          summaryBullets: [],
        }),
      });

      if (!response.ok) {
        setMessage("Section create failed.");
        return;
      }

      const created = (await response.json()) as {
        id: string;
        title: string;
        order: number;
        summaryBullets?: string[];
      };

      setCvSections((current) => [
        ...current,
        {
          id: created.id,
          title: created.title,
          order: created.order,
          summaryBullets: created.summaryBullets ?? [],
          items: [],
        },
      ]);
      setSectionTitle("");
      setMessage("Section added.");
      refreshPreview();
    });
  }

  async function addItem(sectionId: string, itemId: string, order: number) {
    const poolItem = pool.find((item) => item.id === itemId);
    if (!poolItem) return;

    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections/${sectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          order,
          customTitle: poolItem?.title ?? "",
          customSubtitle: poolItem?.subtitle ?? "",
          customRightTitle: formatRightTitle(poolItem),
          customRightSubtitle: formatRightSubtitle(poolItem),
          customBullets: [],
        }),
      });

      if (!response.ok) {
        setMessage("Item link failed.");
        return;
      }

      const link = (await response.json()) as {
        id: string;
        itemId: string;
        order: number;
        customTitle: string | null;
        customSubtitle: string | null;
        customRightTitle: string | null;
        customRightSubtitle: string | null;
        customBullets: string[];
      };

      setCvSections((current) =>
        current.map((section) => {
          if (section.id !== sectionId) return section;

          const nextEntry: SectionItem = {
            id: link.id,
            itemId: link.itemId,
            order: link.order,
            customTitle: link.customTitle,
            customSubtitle: link.customSubtitle,
            customRightTitle: link.customRightTitle,
            customRightSubtitle: link.customRightSubtitle,
            customBullets: link.customBullets ?? [],
            item: poolItem,
          };

          const existingIndex = section.items.findIndex((entry) => entry.id === link.id);

          if (existingIndex === -1) {
            return {
              ...section,
              items: [...section.items, nextEntry],
            };
          }

          const nextItems = [...section.items];
          nextItems[existingIndex] = nextEntry;

          return {
            ...section,
            items: nextItems,
          };
        }),
      );
      setMessage("Item added.");
      refreshPreview();
    });
  }

  async function updateBullets(
    sectionId: string,
    itemLinkId: string,
    customBullets: string[],
  ) {
    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections/${sectionId}/items/${itemLinkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customBullets }),
      });

      if (!response.ok) {
        setMessage("Custom bullets failed.");
        return;
      }

      setCvSections((current) =>
        current.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            items: section.items.map((entry) =>
              entry.id === itemLinkId ? { ...entry, customBullets } : entry,
            ),
          };
        }),
      );
      setMessage("Custom bullets saved.");
      refreshPreview();
    });
  }

  async function updateEntryFields(sectionId: string, entry: SectionItem) {
    const draft = getDraft(entry);

    startTransition(async () => {
      const response = await fetch(`/api/cvs/${cvId}/sections/${sectionId}/items/${entry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        setMessage("Entry details save failed.");
        return;
      }

      setCvSections((current) =>
        current.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            items: section.items.map((currentEntry) =>
              currentEntry.id === entry.id
                ? {
                    ...currentEntry,
                    customTitle: draft.customTitle,
                    customSubtitle: draft.customSubtitle,
                    customRightTitle: draft.customRightTitle,
                    customRightSubtitle: draft.customRightSubtitle,
                  }
                : currentEntry,
            ),
          };
        }),
      );
      setMessage("Entry details saved.");
      refreshPreview();
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

      setCvSections((current) =>
        current.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.filter((entry) => entry.id !== itemLinkId),
              }
            : section,
        ),
      );
      setMessage("Item removed.");
      refreshPreview();
    });
  }

  async function updateSectionBullets(sectionId: string, summaryBullets: string[]) {
    startTransition(async () => {
      const section = cvSections.find((entry) => entry.id === sectionId);
      if (!section) return;

      const response = await fetch(`/api/cvs/${cvId}/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: section.title,
          order: section.order,
          summaryBullets,
        }),
      });

      if (!response.ok) {
        setMessage("Section bullet save failed.");
        return;
      }

      setCvSections((current) =>
        current.map((entry) =>
          entry.id === sectionId
            ? {
                ...entry,
                summaryBullets,
              }
            : entry,
        ),
      );
      setMessage("Section bullets saved.");
      refreshPreview();
    });
  }

  async function createSectionEntry(section: Section) {
    const draft = getSectionEntryDraft(section);
    const title = draft.title.trim();

    if (!title) {
      setMessage("Entry heading is required.");
      return;
    }

    const bullets = splitLines(draft.bulletsText);
    const technologies = splitCommaSeparated(draft.technologiesText);

    startTransition(async () => {
      const createItemResponse = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: draft.type,
          title,
          subtitle: draft.subtitle.trim() || null,
          description: null,
          bullets,
          technologies,
          tags: [],
          dateStart: null,
          dateEnd: null,
          url: null,
          meta: draft.rightSubtitle.trim()
            ? { location: draft.rightSubtitle.trim() }
            : {},
        }),
      });

      if (!createItemResponse.ok) {
        setMessage("Entry create failed.");
        return;
      }

      const createdItem = (await createItemResponse.json()) as {
        id: string;
        title: string;
        subtitle: string | null;
        type: ItemType;
        tags: string[];
        technologies: string[];
        dateStart: string | null;
        dateEnd: string | null;
        url: string | null;
      };

      const linkResponse = await fetch(`/api/cvs/${cvId}/sections/${section.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: createdItem.id,
          order: section.items.length,
          customTitle: title,
          customSubtitle: draft.subtitle.trim() || "",
          customRightTitle: draft.rightTitle.trim() || "",
          customRightSubtitle: draft.rightSubtitle.trim() || "",
          customBullets: bullets,
        }),
      });

      if (!linkResponse.ok) {
        setMessage("Entry link failed.");
        return;
      }

      const link = (await linkResponse.json()) as {
        id: string;
        itemId: string;
        order: number;
        customTitle: string | null;
        customSubtitle: string | null;
        customRightTitle: string | null;
        customRightSubtitle: string | null;
        customBullets: string[];
      };

      const nextPoolItem: PoolItem = {
        id: createdItem.id,
        title: createdItem.title,
        subtitle: createdItem.subtitle,
        type: createdItem.type,
        tags: createdItem.tags ?? [],
        technologies: createdItem.technologies ?? [],
        dateStart: createdItem.dateStart,
        dateEnd: createdItem.dateEnd,
        url: createdItem.url,
        meta: draft.rightSubtitle.trim() ? { location: draft.rightSubtitle.trim() } : {},
      };

      setCvSections((current) =>
        current.map((currentSection) => {
          if (currentSection.id !== section.id) return currentSection;
          return {
            ...currentSection,
            items: [
              ...currentSection.items,
              {
                id: link.id,
                itemId: link.itemId,
                order: link.order,
                customTitle: link.customTitle,
                customSubtitle: link.customSubtitle,
                customRightTitle: link.customRightTitle,
                customRightSubtitle: link.customRightSubtitle,
                customBullets: link.customBullets ?? [],
                item: nextPoolItem,
              },
            ],
          };
        }),
      );

      resetSectionEntryDraft(section);

      setMessage("Entry added.");
      refreshPreview();
    });
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[300px,1fr,minmax(420px,0.95fr)]">
      <aside className="panel-strong p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-950">Master profile pool</p>
            <p className="text-sm text-slate-600">Add entries into sections, then customize the Overleaf-style rows.</p>
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{item.type}</p>
              <h3 className="mt-2 font-semibold text-slate-950">{item.title}</h3>
              {item.subtitle ? <p className="mt-1 text-sm italic text-slate-600">{item.subtitle}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {cvSections.map((section) => (
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

      <section className="space-y-4 min-[1400px]:min-w-0">
        <details className="panel-strong p-5" open>
          <summary className="cursor-pointer text-sm font-medium text-slate-800">Add section</summary>
          <div className="mt-3 flex gap-3">
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
        </details>

        {cvSections.map((section) => {
          const sectionEntryDraft = getSectionEntryDraft(section);

          return (
            <article key={section.id} className="panel-strong p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Section {section.order + 1}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
                </div>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs text-teal-900">
                  {section.items.length} items
                </span>
              </div>

              <details className="mt-4 rounded-2xl border border-black/10 p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-800">Quick add entry</summary>
                <p className="mt-2 text-xs text-slate-600">Use the four hierarchy fields. Optional metadata stays collapsed.</p>

                <div className="form-grid mt-3">
                  <label className="form-field">
                    <span className="label-text">Heading</span>
                    <input
                      className="input-base"
                      onChange={(event) =>
                        updateSectionEntryDraft(section, {
                          title: event.target.value,
                        })
                      }
                      placeholder="Company / School / Project"
                      value={sectionEntryDraft.title}
                    />
                  </label>
                  <label className="form-field">
                    <span className="label-text">Right side</span>
                    <input
                      className="input-base"
                      onChange={(event) =>
                        updateSectionEntryDraft(section, {
                          rightTitle: event.target.value,
                        })
                      }
                      placeholder="Jan 2023 - May 2025"
                      value={sectionEntryDraft.rightTitle}
                    />
                  </label>
                  <label className="form-field">
                    <span className="label-text">Subheading</span>
                    <input
                      className="input-base"
                      onChange={(event) =>
                        updateSectionEntryDraft(section, {
                          subtitle: event.target.value,
                        })
                      }
                      placeholder="Software Engineer"
                      value={sectionEntryDraft.subtitle}
                    />
                  </label>
                  <label className="form-field">
                    <span className="label-text">Additional info</span>
                    <input
                      className="input-base"
                      onChange={(event) =>
                        updateSectionEntryDraft(section, {
                          rightSubtitle: event.target.value,
                        })
                      }
                      placeholder="City, State"
                      value={sectionEntryDraft.rightSubtitle}
                    />
                  </label>
                </div>

                <label className="form-field mt-3 block">
                  <span className="label-text">Bullets (optional, one per line)</span>
                  <textarea
                    className="input-base min-h-24"
                    onChange={(event) =>
                      updateSectionEntryDraft(section, {
                        bulletsText: event.target.value,
                      })
                    }
                    placeholder="Implemented X and improved Y by Z%&#10;Led A and shipped B"
                    value={sectionEntryDraft.bulletsText}
                  />
                </label>

                <details className="mt-3 rounded-xl border border-black/10 px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700">Optional fields</summary>
                  <div className="mt-3 grid gap-3 lg:grid-cols-[180px,1fr]">
                    <label className="form-field">
                      <span className="label-text">Entry type</span>
                      <select
                        className="input-base"
                        onChange={(event) =>
                          updateSectionEntryDraft(section, {
                            type: event.target.value as ItemType,
                          })
                        }
                        value={sectionEntryDraft.type}
                      >
                        <option value="PROJECT">Project</option>
                        <option value="EXPERIENCE">Experience</option>
                        <option value="EDUCATION">Education</option>
                        <option value="SKILL">Skill</option>
                        <option value="CERTIFICATION">Certification</option>
                      </select>
                    </label>
                    <label className="form-field">
                      <span className="label-text">Technologies (comma separated)</span>
                      <input
                        className="input-base"
                        onChange={(event) =>
                          updateSectionEntryDraft(section, {
                            technologiesText: event.target.value,
                          })
                        }
                        placeholder="React, Node.js, Prisma"
                        value={sectionEntryDraft.technologiesText}
                      />
                    </label>
                  </div>
                </details>

                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-primary"
                    disabled={pending}
                    onClick={() => createSectionEntry(section)}
                    type="button"
                  >
                    Add entry
                  </button>
                  <button
                    className="btn-secondary"
                    disabled={pending}
                    onClick={() => resetSectionEntryDraft(section)}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              </details>

              <details className="mt-4 rounded-2xl border border-black/10 p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-800">Section bullets</summary>
                <div className="mt-3">
                  <RichBulletEditor
                    initialBullets={section.summaryBullets}
                    label="Section bullets"
                    onSave={(bullets) => updateSectionBullets(section.id, bullets)}
                  />
                </div>
              </details>

              <div className="mt-4 space-y-3">
                {section.items.map((entry) => {
                  const draft = getDraft(entry);

                  return (
                    <div key={entry.id} className="rounded-2xl border border-black/10 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                            {entry.item.type}
                          </p>
                          <h3 className="mt-1 font-semibold text-slate-950">{draft.customTitle || entry.item.title}</h3>
                          {draft.customSubtitle ? (
                            <p className="text-sm italic text-slate-600">{draft.customSubtitle}</p>
                          ) : null}
                        </div>
                        <button className="btn-secondary" onClick={() => removeItem(section.id, entry.id)} type="button">
                          Remove
                        </button>
                      </div>

                      <details className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-3">
                        <summary className="cursor-pointer text-sm font-medium text-slate-700">Edit entry details and bullets</summary>
                        <div className="form-grid mt-3">
                          <label className="form-field">
                            <span className="label-text">Heading</span>
                            <input
                              className="input-base"
                              onChange={(event) => updateDraft(entry, { customTitle: event.target.value })}
                              value={draft.customTitle}
                            />
                          </label>
                          <label className="form-field">
                            <span className="label-text">Right side</span>
                            <input
                              className="input-base"
                              onChange={(event) => updateDraft(entry, { customRightTitle: event.target.value })}
                              value={draft.customRightTitle}
                            />
                          </label>
                          <label className="form-field">
                            <span className="label-text">Subheading</span>
                            <input
                              className="input-base"
                              onChange={(event) => updateDraft(entry, { customSubtitle: event.target.value })}
                              value={draft.customSubtitle}
                            />
                          </label>
                          <label className="form-field">
                            <span className="label-text">Additional info</span>
                            <input
                              className="input-base"
                              onChange={(event) => updateDraft(entry, { customRightSubtitle: event.target.value })}
                              value={draft.customRightSubtitle}
                            />
                          </label>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            className="btn-secondary"
                            onClick={() => updateEntryFields(section.id, entry)}
                            type="button"
                          >
                            Save details
                          </button>
                        </div>

                        <div className="mt-3">
                          <RichBulletEditor
                            initialBullets={entry.customBullets}
                            label="Custom bullets"
                            onSave={(bullets) => updateBullets(section.id, entry.id, bullets)}
                          />
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>

      <aside className="panel-strong h-[72vh] p-4 min-[1400px]:sticky min-[1400px]:top-5 min-[1400px]:h-[calc(100vh-7rem)]">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-950">Preview PDF</p>
          <p className="text-sm text-slate-600">Preview uses the exported PDF stream, not an HTML approximation.</p>
        </div>
        <iframe
          className="mt-3 h-[calc(100%-3.8rem)] min-h-[560px] w-full rounded-2xl border border-black/10 bg-white"
          key={previewReloadToken ?? "initial-preview"}
          src={previewReloadToken ? `${previewHref}?v=${previewReloadToken}` : previewHref}
          title="CV preview"
        />
      </aside>
    </div>
  );
}

function formatMonthYear(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRightTitle(item?: PoolItem) {
  if (!item) return "";
  if (item.dateStart || item.dateEnd) {
    const start = formatMonthYear(item.dateStart);
    const end = formatMonthYear(item.dateEnd) || "Present";
    return [start, end].filter(Boolean).join(" - ");
  }
  return "";
}

function formatRightSubtitle(item?: PoolItem) {
  if (!item) return "";
  const location = item.meta.location;
  return typeof location === "string" ? location : "";
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function splitCommaSeparated(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function inferItemTypeFromSection(sectionTitle: string): ItemType {
  const normalized = sectionTitle.toLowerCase();

  if (normalized.includes("education")) return "EDUCATION";
  if (normalized.includes("experience")) return "EXPERIENCE";
  if (normalized.includes("project")) return "PROJECT";
  if (normalized.includes("skill")) return "SKILL";
  if (normalized.includes("cert")) return "CERTIFICATION";

  return "EXPERIENCE";
}
