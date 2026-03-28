"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

type RichBulletEditorProps = {
  label: string;
  initialBullets: string[];
  onSave: (bullets: string[]) => Promise<void> | void;
};

const modules = {
  toolbar: [
    [{ font: [] }, { size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "clean"],
  ],
};

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "indent",
  "link",
];

function normalizeBullet(html: string) {
  const trimmed = html.replace(/^<p><br><\/p>$/i, "").trim();
  return trimmed;
}

export function RichBulletEditor({
  label,
  initialBullets,
  onSave,
}: RichBulletEditorProps) {
  const [bullets, setBullets] = useState(
    initialBullets.length ? initialBullets : [""],
  );
  const [saving, setSaving] = useState(false);

  const normalizedBullets = useMemo(
    () => bullets.map(normalizeBullet).filter(Boolean),
    [bullets],
  );

  function updateBullet(index: number, value: string) {
    setBullets((current) => current.map((entry, i) => (i === index ? value : entry)));
  }

  function addBullet() {
    setBullets((current) => [...current, ""]);
  }

  function removeBullet(index: number) {
    setBullets((current) => {
      const next = current.filter((_, i) => i !== index);
      return next.length ? next : [""];
    });
  }

  async function save() {
    setSaving(true);
    try {
      await onSave(normalizedBullets);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="label-text !mb-0">{label}</span>
        <div className="flex gap-2">
          <button className="btn-secondary !rounded-xl !px-3 !py-2" onClick={addBullet} type="button">
            Add bullet
          </button>
          <button className="btn-primary !rounded-xl !px-3 !py-2" disabled={saving} onClick={save} type="button">
            {saving ? "Saving..." : "Save bullets"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet, index) => (
          <div key={`${label}-${index}`} className="rounded-2xl border border-black/10 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Bullet {index + 1}
              </p>
              <button className="btn-secondary !rounded-xl !px-3 !py-2" onClick={() => removeBullet(index)} type="button">
                Delete
              </button>
            </div>
            <ReactQuill
              formats={formats}
              modules={modules}
              onChange={(value) => updateBullet(index, value)}
              theme="snow"
              value={bullet}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
