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

const starterTemplate = String.raw`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font.css" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="m-0 bg-white">
<div class="max-w-[780px] mx-auto px-12 py-6 font-serif text-black text-sm leading-snug">
  <header class="text-center mb-2">
    <h1 class="m-0 text-[42px] leading-none font-bold">{{profile.name}}</h1>
    <p class="mt-1 text-sm leading-snug">
      {{#if profile.phone}}<span>&#9742; {{profile.phone}}</span>{{/if}}
      <span>{{#if profile.phone}} &nbsp;|&nbsp; {{/if}}&#9993; {{profile.email}}</span>
      {{#if profile.linkedin}}<span> &nbsp;|&nbsp; <a class="text-black no-underline" href="{{profile.linkedin}}">{{profile.linkedin}}</a></span>{{/if}}
      {{#if profile.github}}<span> &nbsp;|&nbsp; <a class="text-black no-underline" href="{{profile.github}}">{{profile.github}}</a></span>{{/if}}
      {{#if profile.website}}<span> &nbsp;|&nbsp; <a class="text-black no-underline" href="{{profile.website}}">{{profile.website}}</a></span>{{/if}}
    </p>
  </header>

  {{#each sections}}
    <section class="mt-2.5 text-black">
      <div>
        <p class="font-bold text-sm text-black">{{title}}</p>
        <hr class="border-0 border-t border-black my-0" />
      </div>

      {{#if summaryBullets.length}}
        <div class="mt-1">
          {{#each summaryBullets}}
            <div class="flex items-baseline gap-2 mb-0.5 pl-2.5 text-black">
              <span class="shrink-0 w-4 text-sm">•</span>
              <span class="flex-1 text-sm leading-snug break-words">{{{this}}}</span>
            </div>
          {{/each}}
        </div>
      {{/if}}

      <div class="mt-1">
        {{#each items}}
          <article class="mb-[5px] text-black">
            <div class="w-full pl-2">
              {{#if (eq type "SKILL")}}
                <p class="text-sm leading-snug">
                  <strong>{{title}}: </strong>
                  {{#if bullets.length}}
                    {{#each bullets}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
                  {{/if}}
                </p>
              {{else}}
                <div class="flex flex-row justify-between items-baseline w-full min-w-0 gap-2">
                  <span class="font-bold text-sm flex-1 min-w-0 break-words">
                    {{title}}{{#if technologies.length}} <span class="italic font-normal">| {{#each technologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</span>{{/if}}
                  </span>
                  {{#if rightTitle}}<span class="text-sm whitespace-nowrap shrink-0 pl-3">{{rightTitle}}</span>{{/if}}
                </div>

                <div class="flex justify-between items-baseline w-full min-w-0 italic">
                  {{#if subtitle}}<span class="italic text-sm flex-1 min-w-0 break-words">{{subtitle}}</span>{{else}}<span class="italic text-sm flex-1 min-w-0"></span>{{/if}}
                  {{#if rightSubtitle}}<span class="italic text-sm whitespace-nowrap shrink-0 pl-3">{{rightSubtitle}}</span>{{/if}}
                </div>

                {{#if description}}
                  <p class="text-sm leading-snug break-words">{{description}}</p>
                {{/if}}

                {{#if url}}
                  <p class="text-sm leading-snug break-words"><a class="text-black no-underline" href="{{url}}">{{url}}</a></p>
                {{/if}}

                {{#if bullets.length}}
                  <div class="mt-0.5">
                    {{#each bullets}}
                      <div class="flex items-baseline gap-2 mb-0.5 pl-2.5 text-black">
                        <span class="shrink-0 w-4 text-sm">•</span>
                        <span class="flex-1 text-sm leading-snug break-words">{{{this}}}</span>
                      </div>
                    {{/each}}
                  </div>
                {{/if}}
              {{/if}}
            </div>
          </article>
        {{/each}}
      </div>
    </section>
  {{/each}}
</div>
</body>
</html>`;

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
