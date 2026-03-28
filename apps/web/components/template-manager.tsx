"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

type TemplateRecord = {
  id: string;
  name: string;
  thumbnailUrl: string;
  previewUrl: string;
  isActive: boolean;
  usageCount: number;
};

const starterTemplate = `<main style="font-family:Arial,sans-serif;padding:32px;color:#14213d">
<h1>{{profile.name}}</h1>
<p>{{profile.email}} | {{profile.linkedin}}</p>
{{#each sections}}
  <section style="margin-top:24px">
    <h2>{{title}}</h2>
    {{#each items}}
      <article style="margin-top:12px">
        <h3>{{title}}</h3>
        <p>{{description}}</p>
        <ul>
          {{#each bullets}}<li>{{this}}</li>{{/each}}
        </ul>
      </article>
    {{/each}}
  </section>
{{/each}}
</main>`;

export function TemplateManager({ templates }: { templates: TemplateRecord[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleCreate(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const payload = {
        name: formData.get("name"),
        thumbnailUrl: formData.get("thumbnailUrl"),
        previewUrl: formData.get("previewUrl"),
        templateHtml: formData.get("templateHtml"),
        isActive: true,
      };

      const response = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setMessage("Template save failed.");
        return;
      }

      setMessage("Template saved.");
      window.location.reload();
    });
  }

  async function toggleTemplate(id: string, isActive: boolean) {
    startTransition(async () => {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        setMessage("Toggle failed.");
        return;
      }

      setMessage("Template updated.");
      window.location.reload();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[400px,1fr]">
      <form action={handleCreate} className="rounded-3xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Upload template</h2>
        <div className="mt-4 space-y-4">
          <label>
            <span className="label-text">Template name</span>
            <input className="input-base" name="name" required />
          </label>
          <label>
            <span className="label-text">Thumbnail URL</span>
            <input className="input-base" name="thumbnailUrl" defaultValue="https://res.cloudinary.com/demo/image/upload/sample.jpg" />
          </label>
          <label>
            <span className="label-text">Preview URL</span>
            <input className="input-base" name="previewUrl" defaultValue="https://res.cloudinary.com/demo/image/upload/sample.jpg" />
          </label>
          <label>
            <span className="label-text">Handlebars HTML</span>
            <textarea className="input-base min-h-52 font-mono text-xs" name="templateHtml" defaultValue={starterTemplate} />
          </label>
          <button className="btn-primary w-full" disabled={pending} type="submit">
            {pending ? "Saving..." : "Save template"}
          </button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <Image alt={template.name} className="h-44 w-full object-cover" height={352} src={template.previewUrl} unoptimized width={640} />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-950">{template.name}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {template.usageCount} CVs
                </span>
              </div>
              <p className="text-sm text-slate-600">
                {template.isActive ? "Active template." : "Inactive template."}
              </p>
              <button className="btn-secondary" onClick={() => toggleTemplate(template.id, template.isActive)} type="button">
                {template.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
