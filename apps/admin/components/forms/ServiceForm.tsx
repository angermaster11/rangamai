"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { slugify, linesToList, listToLines } from "@/lib/form";
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  ErrorNote,
  Spinner,
} from "@/components/ui";

type Mode = { kind: "create" } | { kind: "edit"; service: Service };

/** Shared create/edit form for a Service. */
export function ServiceForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const existing = mode.kind === "edit" ? mode.service : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode.kind === "edit");
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [icon, setIcon] = useState(existing?.icon ?? "");
  const [highlights, setHighlights] = useState(listToLines(existing?.highlights));
  const [metaTitle, setMetaTitle] = useState(existing?.seo?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(existing?.seo?.metaDescription ?? "");
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [published, setPublished] = useState(existing?.published ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const payload = {
      title,
      slug,
      shortDescription,
      description,
      icon: icon || undefined,
      highlights: linesToList(highlights),
      featured,
      published,
      seo:
        metaTitle || metaDescription
          ? { metaTitle: metaTitle || undefined, metaDescription: metaDescription || undefined }
          : undefined,
    };

    try {
      if (existing) {
        await api.patch<Service>(`/admin/services/${existing.id}`, payload);
      } else {
        await api.post<Service>("/admin/services", payload);
      }
      router.push("/services");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setError("Failed to save.");
      }
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <Card className="space-y-4">
        <Field label="Title" htmlFor="title" required error={fieldErrors.title}>
          <Input id="title" value={title} onChange={(e) => onTitleChange(e.target.value)} required />
        </Field>
        <Field
          label="Slug"
          htmlFor="slug"
          required
          error={fieldErrors.slug}
          hint="URL path: /services/<slug>. Lowercase, hyphenated."
        >
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            required
          />
        </Field>
        <Field
          label="Short description"
          htmlFor="shortDescription"
          required
          error={fieldErrors.shortDescription}
          hint="One line, shown on cards and previews."
        >
          <Textarea
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </Field>
        <Field label="Full description" htmlFor="description" required error={fieldErrors.description}>
          <Textarea
            id="description"
            className="min-h-40"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Field>
        <Field
          label="Icon"
          htmlFor="icon"
          hint="lucide-react icon name, e.g. Bot, BrainCircuit, Globe."
          error={fieldErrors.icon}
        >
          <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
        </Field>
        <Field
          label="Highlights"
          htmlFor="highlights"
          hint="One per line — the 'what's included' bullets."
        >
          <Textarea
            id="highlights"
            className="min-h-32"
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          SEO
        </h2>
        <Field label="Meta title" htmlFor="metaTitle" hint="Leave blank to use the title.">
          <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </Field>
        <Field label="Meta description" htmlFor="metaDescription">
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </Field>
      </Card>

      <Card className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Published (visible on the site)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Featured on homepage
        </label>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner /> : null}
          {existing ? "Save changes" : "Create service"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/services")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
