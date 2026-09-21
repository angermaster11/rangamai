"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { Project, ProjectMetric, MediaRef } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { slugify, linesToList, listToLines, csvToList, listToCsv } from "@/lib/form";
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  ErrorNote,
  Spinner,
} from "@/components/ui";

type Mode = { kind: "create" } | { kind: "edit"; project: Project };

/** Editable draft rows keep a stable key so React inputs don't lose focus. */
type MetricRow = { key: string; label: string; value: string };
type GalleryRow = { key: string; url: string; alt: string };

let rowSeq = 0;
const nextKey = () => `row-${rowSeq++}`;

function toMetricRows(metrics?: ProjectMetric[]): MetricRow[] {
  return (metrics ?? []).map((m) => ({ key: nextKey(), label: m.label, value: m.value }));
}
function toGalleryRows(gallery?: MediaRef[]): GalleryRow[] {
  return (gallery ?? []).map((g) => ({ key: nextKey(), url: g.url, alt: g.alt }));
}

/** Shared create/edit form for a Project (case study). */
export function ProjectForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const existing = mode.kind === "edit" ? mode.project : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode.kind === "edit");
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [problem, setProblem] = useState(existing?.problem ?? "");
  const [solution, setSolution] = useState(existing?.solution ?? "");
  const [keyFeatures, setKeyFeatures] = useState(listToLines(existing?.keyFeatures));
  const [techStack, setTechStack] = useState(listToCsv(existing?.techStack));
  const [client, setClient] = useState(existing?.client ?? "");
  const [industry, setIndustry] = useState(existing?.industry ?? "");
  const [servicesUsed, setServicesUsed] = useState(listToCsv(existing?.servicesUsed));
  const [liveUrl, setLiveUrl] = useState(existing?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(existing?.githubUrl ?? "");
  const [coverUrl, setCoverUrl] = useState(existing?.coverImage?.url ?? "");
  const [coverAlt, setCoverAlt] = useState(existing?.coverImage?.alt ?? "");
  const [metrics, setMetrics] = useState<MetricRow[]>(toMetricRows(existing?.metrics));
  const [gallery, setGallery] = useState<GalleryRow[]>(toGalleryRows(existing?.gallery));
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

    const cleanMetrics = metrics
      .map((m) => ({ label: m.label.trim(), value: m.value.trim() }))
      .filter((m) => m.label && m.value);
    const cleanGallery = gallery
      .map((g) => ({ url: g.url.trim(), alt: g.alt.trim() }))
      .filter((g) => g.url);

    const payload = {
      title,
      slug,
      shortDescription,
      description,
      problem: problem || undefined,
      solution: solution || undefined,
      keyFeatures: linesToList(keyFeatures),
      techStack: csvToList(techStack),
      metrics: cleanMetrics.length ? cleanMetrics : undefined,
      client: client || undefined,
      industry: industry || undefined,
      servicesUsed: csvToList(servicesUsed),
      gallery: cleanGallery.length ? cleanGallery : undefined,
      coverImage: coverUrl ? { url: coverUrl, alt: coverAlt } : undefined,
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined,
      featured,
      published,
      seo:
        metaTitle || metaDescription
          ? { metaTitle: metaTitle || undefined, metaDescription: metaDescription || undefined }
          : undefined,
    };

    try {
      if (existing) {
        await api.patch<Project>(`/admin/projects/${existing.id}`, payload);
      } else {
        await api.post<Project>("/admin/projects", payload);
      }
      router.push("/projects");
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
          hint="URL path: /showcase/<slug>. Lowercase, hyphenated."
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
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Case study
        </h2>
        <Field label="Problem" htmlFor="problem" error={fieldErrors.problem}>
          <Textarea id="problem" value={problem} onChange={(e) => setProblem(e.target.value)} />
        </Field>
        <Field label="Solution" htmlFor="solution" error={fieldErrors.solution}>
          <Textarea id="solution" value={solution} onChange={(e) => setSolution(e.target.value)} />
        </Field>
        <Field label="Key features" htmlFor="keyFeatures" hint="One per line.">
          <Textarea
            id="keyFeatures"
            className="min-h-32"
            value={keyFeatures}
            onChange={(e) => setKeyFeatures(e.target.value)}
          />
        </Field>
        <Field label="Tech stack" htmlFor="techStack" hint="Comma-separated, e.g. Next.js, NestJS, MongoDB.">
          <Input id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Metrics
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMetrics((rows) => [...rows, { key: nextKey(), label: "", value: "" }])}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add metric
          </Button>
        </div>
        {metrics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No metrics. Add before/after numbers to show impact.</p>
        ) : (
          metrics.map((m, i) => (
            <div key={m.key} className="flex items-end gap-2">
              <Field label="Label" htmlFor={`metric-label-${m.key}`} className="flex-1">
                <Input
                  id={`metric-label-${m.key}`}
                  value={m.label}
                  placeholder="Load time"
                  onChange={(e) =>
                    setMetrics((rows) => rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label="Value" htmlFor={`metric-value-${m.key}`} className="flex-1">
                <Input
                  id={`metric-value-${m.key}`}
                  value={m.value}
                  placeholder="2.1s → 0.4s"
                  onChange={(e) =>
                    setMetrics((rows) => rows.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))
                  }
                />
              </Field>
              <button
                type="button"
                onClick={() => setMetrics((rows) => rows.filter((_, j) => j !== i))}
                className="mb-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Remove metric"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Client" htmlFor="client" error={fieldErrors.client}>
            <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} />
          </Field>
          <Field label="Industry" htmlFor="industry" error={fieldErrors.industry}>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </Field>
        </div>
        <Field
          label="Services used"
          htmlFor="servicesUsed"
          hint="Comma-separated service slugs, e.g. ai-agents, web-apps."
        >
          <Input
            id="servicesUsed"
            value={servicesUsed}
            onChange={(e) => setServicesUsed(e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Live URL" htmlFor="liveUrl" error={fieldErrors.liveUrl}>
            <Input
              id="liveUrl"
              type="url"
              value={liveUrl}
              placeholder="https://…"
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </Field>
          <Field label="GitHub URL" htmlFor="githubUrl" error={fieldErrors.githubUrl}>
            <Input
              id="githubUrl"
              type="url"
              value={githubUrl}
              placeholder="https://github.com/…"
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Cover image
        </h2>
        <Field label="Image URL" htmlFor="coverUrl" hint="Paste a URL from the Media library.">
          <Input
            id="coverUrl"
            type="url"
            value={coverUrl}
            placeholder="https://res.cloudinary.com/…"
            onChange={(e) => setCoverUrl(e.target.value)}
          />
        </Field>
        <Field label="Alt text" htmlFor="coverAlt" hint="Describe the image for accessibility.">
          <Input id="coverAlt" value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Gallery
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setGallery((rows) => [...rows, { key: nextKey(), url: "", alt: "" }])}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add image
          </Button>
        </div>
        {gallery.length === 0 ? (
          <p className="text-sm text-muted-foreground">No gallery images.</p>
        ) : (
          gallery.map((g, i) => (
            <div key={g.key} className="flex items-end gap-2">
              <Field label="URL" htmlFor={`gallery-url-${g.key}`} className="flex-1">
                <Input
                  id={`gallery-url-${g.key}`}
                  type="url"
                  value={g.url}
                  placeholder="https://res.cloudinary.com/…"
                  onChange={(e) =>
                    setGallery((rows) => rows.map((r, j) => (j === i ? { ...r, url: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label="Alt" htmlFor={`gallery-alt-${g.key}`} className="flex-1">
                <Input
                  id={`gallery-alt-${g.key}`}
                  value={g.alt}
                  onChange={(e) =>
                    setGallery((rows) => rows.map((r, j) => (j === i ? { ...r, alt: e.target.value } : r)))
                  }
                />
              </Field>
              <button
                type="button"
                onClick={() => setGallery((rows) => rows.filter((_, j) => j !== i))}
                className="mb-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Remove gallery image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
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
          {existing ? "Save changes" : "Create project"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
