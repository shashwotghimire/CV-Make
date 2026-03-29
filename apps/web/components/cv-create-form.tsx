"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

type TemplateOption = {
  id: string;
  name: string;
  thumbnailUrl: string;
};

export function CVCreateForm({ templates }: { templates: TemplateOption[] }) {
  const [selected, setSelected] = useState(templates[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const payload = {
        name: formData.get("name"),
        templateId: formData.get("templateId"),
      };

      const response = await fetch("/api/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setMessage("CV creation failed.");
        return;
      }

      const created = (await response.json()) as { id: string };
      window.location.href = `/cv/${created.id}`;
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <label className="panel-strong block p-5">
        <span className="label-text">CV name</span>
        <input className="input-base" name="name" placeholder="Backend roles - 2026" required />
      </label>

      <input name="templateId" type="hidden" value={selected} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`panel-strong overflow-hidden text-left transition ${
              selected === template.id ? "border-teal-500 ring-4 ring-teal-100" : "border-black/10"
            }`}
            onClick={() => setSelected(template.id)}
            type="button"
          >
            <Image alt={template.name} className="h-40 w-full object-cover" height={320} src={template.thumbnailUrl} unoptimized width={640} />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-950">{template.name}</h3>
              <p className="mt-2 text-sm text-slate-600">Admin uploaded template ready for live preview and export.</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={pending || !selected} type="submit">
          {pending ? "Creating..." : "Create CV"}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </form>
  );
}
