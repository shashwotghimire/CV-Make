"use client";

import { useState, useTransition } from "react";

type ProfileFormProps = {
  defaultValues: {
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
    bio: string | null;
  };
  onboarding?: boolean;
};

export function ProfileForm({ defaultValues, onboarding = false }: ProfileFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setMessage("Save failed.");
        return;
      }

      setMessage(onboarding ? "Profile saved. Continue to dashboard." : "Profile saved.");

      if (onboarding) {
        window.location.href = "/dashboard";
      }
    });
  }

  return (
    <form action={handleSubmit} className="panel-strong grid gap-4 p-5 md:grid-cols-2">
      <label>
        <span className="label-text">Phone</span>
        <input className="input-base" name="phone" defaultValue={defaultValues.phone ?? ""} />
      </label>
      <label>
        <span className="label-text">Location</span>
        <input className="input-base" name="location" defaultValue={defaultValues.location ?? ""} />
      </label>
      <label>
        <span className="label-text">LinkedIn</span>
        <input className="input-base" name="linkedin" defaultValue={defaultValues.linkedin ?? ""} />
      </label>
      <label>
        <span className="label-text">GitHub</span>
        <input className="input-base" name="github" defaultValue={defaultValues.github ?? ""} />
      </label>
      <label>
        <span className="label-text">Website</span>
        <input className="input-base" name="website" defaultValue={defaultValues.website ?? ""} />
      </label>
      <label className="md:col-span-2">
        <span className="label-text">Bio</span>
        <textarea className="input-base min-h-32" name="bio" defaultValue={defaultValues.bio ?? ""} />
      </label>
      <div className="md:col-span-2 flex items-center gap-3">
        <button className="btn-primary" disabled={pending} type="submit">
          {pending ? "Saving..." : onboarding ? "Complete onboarding" : "Save profile"}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </form>
  );
}
