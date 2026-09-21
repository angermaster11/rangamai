"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Homepage, Service, Project, ValueProp, ProcessStep } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { csvToList, listToCsv } from "@/lib/form";
import { PageHeader } from "@/components/PageHeader";
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  Badge,
  ErrorNote,
  Spinner,
} from "@/components/ui";

type ValueRow = { key: string; title: string; description: string; icon: string };
type StepRow = { key: string; title: string; description: string; icon: string };

let rowSeq = 0;
const nextKey = () => `hp-${rowSeq++}`;

function toValueRows(props?: ValueProp[]): ValueRow[] {
  return (props ?? []).map((p) => ({
    key: nextKey(),
    title: p.title,
    description: p.description,
    icon: p.icon ?? "",
  }));
}
function toStepRows(steps?: ProcessStep[]): StepRow[] {
  return (steps ?? []).map((s) => ({
    key: nextKey(),
    title: s.title,
    description: s.description,
    icon: s.icon ?? "",
  }));
}

export default function HomepageCmsPage() {
  const home = useAsync<Homepage>(() => api.get<Homepage>("/admin/homepage"), []);
  const services = useAsync<Service[]>(() => api.get<Service[]>("/admin/services"), []);
  const projects = useAsync<Project[]>(() => api.get<Project[]>("/admin/projects"), []);

  return (
    <>
      <PageHeader
        title="Homepage"
        description="Hero, featured picks, why-us, process, and the closing call to action."
      />
      {home.loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : home.error || !home.data ? (
        <ErrorNote>{home.error ?? "Couldn't load homepage content."}</ErrorNote>
      ) : (
        <HomepageForm
          initial={home.data}
          services={services.data ?? []}
          projects={projects.data ?? []}
        />
      )}
    </>
  );
}

/** A comma-separated ordered-slug editor with clickable "add" chips of available items. */
function SlugPicker({
  value,
  onChange,
  available,
  emptyHint,
}: {
  value: string;
  onChange: (v: string) => void;
  available: { slug: string; title: string }[];
  emptyHint: string;
}) {
  const selected = csvToList(value);
  const remaining = available.filter((a) => !selected.includes(a.slug));

  return (
    <div className="space-y-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="comma-separated slugs, in display order"
      />
      {available.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyHint}</p>
      ) : remaining.length ? (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground">Add:</span>
          {remaining.map((a) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => onChange(listToCsv([...selected, a.slug]))}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
              title={a.title}
            >
              <Plus className="h-3 w-3" aria-hidden />
              {a.slug}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">All available items are selected.</p>
      )}
    </div>
  );
}

function HomepageForm({
  initial,
  services,
  projects,
}: {
  initial: Homepage;
  services: Service[];
  projects: Project[];
}) {
  const [heroHeading, setHeroHeading] = useState(initial.heroHeading ?? "");
  const [heroSubheading, setHeroSubheading] = useState(initial.heroSubheading ?? "");
  const [heroPrimaryLabel, setHeroPrimaryLabel] = useState(initial.heroPrimaryCta?.label ?? "");
  const [heroPrimaryHref, setHeroPrimaryHref] = useState(initial.heroPrimaryCta?.href ?? "");
  const [heroSecondaryLabel, setHeroSecondaryLabel] = useState(initial.heroSecondaryCta?.label ?? "");
  const [heroSecondaryHref, setHeroSecondaryHref] = useState(initial.heroSecondaryCta?.href ?? "");
  const [featuredServices, setFeaturedServices] = useState(listToCsv(initial.featuredServiceSlugs));
  const [featuredProjects, setFeaturedProjects] = useState(listToCsv(initial.featuredProjectSlugs));
  const [whyHeading, setWhyHeading] = useState(initial.whyHeading ?? "");
  const [whySubheading, setWhySubheading] = useState(initial.whySubheading ?? "");
  const [valueProps, setValueProps] = useState<ValueRow[]>(toValueRows(initial.valueProps));
  const [processHeading, setProcessHeading] = useState(initial.processHeading ?? "");
  const [processSteps, setProcessSteps] = useState<StepRow[]>(toStepRows(initial.processSteps));
  const [finalCtaHeading, setFinalCtaHeading] = useState(initial.finalCtaHeading ?? "");
  const [finalCtaSubheading, setFinalCtaSubheading] = useState(initial.finalCtaSubheading ?? "");
  const [finalCtaLabel, setFinalCtaLabel] = useState(initial.finalCta?.label ?? "");
  const [finalCtaHref, setFinalCtaHref] = useState(initial.finalCta?.href ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      heroHeading,
      heroSubheading,
      heroPrimaryCta: { label: heroPrimaryLabel, href: heroPrimaryHref },
      heroSecondaryCta:
        heroSecondaryLabel || heroSecondaryHref
          ? { label: heroSecondaryLabel, href: heroSecondaryHref }
          : undefined,
      featuredServiceSlugs: csvToList(featuredServices),
      featuredProjectSlugs: csvToList(featuredProjects),
      whyHeading,
      whySubheading: whySubheading || undefined,
      valueProps: valueProps
        .map((v) => ({
          title: v.title.trim(),
          description: v.description.trim(),
          icon: v.icon.trim() || undefined,
        }))
        .filter((v) => v.title && v.description),
      processHeading,
      processSteps: processSteps
        .map((s, i) => ({
          step: i + 1,
          title: s.title.trim(),
          description: s.description.trim(),
          icon: s.icon.trim() || undefined,
        }))
        .filter((s) => s.title && s.description),
      finalCtaHeading,
      finalCtaSubheading: finalCtaSubheading || undefined,
      finalCta: { label: finalCtaLabel, href: finalCtaHref },
    };

    try {
      await api.patch<Homepage>("/admin/homepage", payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Hero
        </h2>
        <Field label="Heading" htmlFor="heroHeading" required>
          <Input id="heroHeading" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} required />
        </Field>
        <Field label="Subheading" htmlFor="heroSubheading" required>
          <Textarea
            id="heroSubheading"
            value={heroSubheading}
            onChange={(e) => setHeroSubheading(e.target.value)}
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary CTA label" htmlFor="heroPrimaryLabel">
            <Input id="heroPrimaryLabel" value={heroPrimaryLabel} onChange={(e) => setHeroPrimaryLabel(e.target.value)} />
          </Field>
          <Field label="Primary CTA link" htmlFor="heroPrimaryHref">
            <Input id="heroPrimaryHref" value={heroPrimaryHref} onChange={(e) => setHeroPrimaryHref(e.target.value)} placeholder="/contact" />
          </Field>
          <Field label="Secondary CTA label" htmlFor="heroSecondaryLabel">
            <Input id="heroSecondaryLabel" value={heroSecondaryLabel} onChange={(e) => setHeroSecondaryLabel(e.target.value)} />
          </Field>
          <Field label="Secondary CTA link" htmlFor="heroSecondaryHref">
            <Input id="heroSecondaryHref" value={heroSecondaryHref} onChange={(e) => setHeroSecondaryHref(e.target.value)} placeholder="/showcase" />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Featured on homepage
        </h2>
        <Field label="Featured services" htmlFor="featuredServices">
          <SlugPicker
            value={featuredServices}
            onChange={setFeaturedServices}
            available={services.map((s) => ({ slug: s.slug, title: s.title }))}
            emptyHint="No services yet — create some under Services."
          />
        </Field>
        <Field label="Featured projects" htmlFor="featuredProjects">
          <SlugPicker
            value={featuredProjects}
            onChange={setFeaturedProjects}
            available={projects.map((p) => ({ slug: p.slug, title: p.title }))}
            emptyHint="No projects yet — create some under Showcase."
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Why RANGAMAI
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setValueProps((rows) => [...rows, { key: nextKey(), title: "", description: "", icon: "" }])
            }
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add value
          </Button>
        </div>
        <Field label="Section heading" htmlFor="whyHeading">
          <Input id="whyHeading" value={whyHeading} onChange={(e) => setWhyHeading(e.target.value)} />
        </Field>
        <Field label="Section subheading" htmlFor="whySubheading">
          <Input id="whySubheading" value={whySubheading} onChange={(e) => setWhySubheading(e.target.value)} />
        </Field>
        {valueProps.map((v, i) => (
          <div key={v.key} className="space-y-2 rounded-md border border-border p-3">
            <div className="flex items-center justify-between">
              <Badge>Value {i + 1}</Badge>
              <button
                type="button"
                onClick={() => setValueProps((rows) => rows.filter((_, j) => j !== i))}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Remove value"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Title" htmlFor={`vp-title-${v.key}`}>
                <Input
                  id={`vp-title-${v.key}`}
                  value={v.title}
                  onChange={(e) =>
                    setValueProps((rows) => rows.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label="Icon" htmlFor={`vp-icon-${v.key}`} hint="lucide-react name.">
                <Input
                  id={`vp-icon-${v.key}`}
                  value={v.icon}
                  onChange={(e) =>
                    setValueProps((rows) => rows.map((r, j) => (j === i ? { ...r, icon: e.target.value } : r)))
                  }
                />
              </Field>
            </div>
            <Field label="Description" htmlFor={`vp-desc-${v.key}`}>
              <Textarea
                id={`vp-desc-${v.key}`}
                value={v.description}
                onChange={(e) =>
                  setValueProps((rows) => rows.map((r, j) => (j === i ? { ...r, description: e.target.value } : r)))
                }
              />
            </Field>
          </div>
        ))}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            How we work
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setProcessSteps((rows) => [...rows, { key: nextKey(), title: "", description: "", icon: "" }])
            }
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add step
          </Button>
        </div>
        <Field label="Section heading" htmlFor="processHeading">
          <Input id="processHeading" value={processHeading} onChange={(e) => setProcessHeading(e.target.value)} />
        </Field>
        {processSteps.map((s, i) => (
          <div key={s.key} className="space-y-2 rounded-md border border-border p-3">
            <div className="flex items-center justify-between">
              <Badge>Step {i + 1}</Badge>
              <button
                type="button"
                onClick={() => setProcessSteps((rows) => rows.filter((_, j) => j !== i))}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Remove step"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Title" htmlFor={`ps-title-${s.key}`}>
                <Input
                  id={`ps-title-${s.key}`}
                  value={s.title}
                  onChange={(e) =>
                    setProcessSteps((rows) => rows.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label="Icon" htmlFor={`ps-icon-${s.key}`} hint="lucide-react name.">
                <Input
                  id={`ps-icon-${s.key}`}
                  value={s.icon}
                  onChange={(e) =>
                    setProcessSteps((rows) => rows.map((r, j) => (j === i ? { ...r, icon: e.target.value } : r)))
                  }
                />
              </Field>
            </div>
            <Field label="Description" htmlFor={`ps-desc-${s.key}`}>
              <Textarea
                id={`ps-desc-${s.key}`}
                value={s.description}
                onChange={(e) =>
                  setProcessSteps((rows) => rows.map((r, j) => (j === i ? { ...r, description: e.target.value } : r)))
                }
              />
            </Field>
          </div>
        ))}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Closing CTA
        </h2>
        <Field label="Heading" htmlFor="finalCtaHeading" required>
          <Input id="finalCtaHeading" value={finalCtaHeading} onChange={(e) => setFinalCtaHeading(e.target.value)} required />
        </Field>
        <Field label="Subheading" htmlFor="finalCtaSubheading">
          <Input id="finalCtaSubheading" value={finalCtaSubheading} onChange={(e) => setFinalCtaSubheading(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label" htmlFor="finalCtaLabel">
            <Input id="finalCtaLabel" value={finalCtaLabel} onChange={(e) => setFinalCtaLabel(e.target.value)} />
          </Field>
          <Field label="Button link" htmlFor="finalCtaHref">
            <Input id="finalCtaHref" value={finalCtaHref} onChange={(e) => setFinalCtaHref(e.target.value)} placeholder="/contact" />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner /> : null}
          Save homepage
        </Button>
        {saved ? <span className="text-sm text-[var(--success)]">Saved.</span> : null}
      </div>
    </form>
  );
}
