"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteSettings, ContactLink } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PageHeader } from "@/components/PageHeader";
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  ErrorNote,
  Spinner,
} from "@/components/ui";

type LinkRow = { key: string; kind: string; label: string; href: string };

let rowSeq = 0;
const nextKey = () => `link-${rowSeq++}`;

function toLinkRows(links?: ContactLink[]): LinkRow[] {
  return (links ?? []).map((l) => ({ key: nextKey(), kind: l.kind, label: l.label, href: l.href }));
}

export default function SettingsPage() {
  const { data, loading, error } = useAsync<SiteSettings>(
    () => api.get<SiteSettings>("/admin/settings"),
    [],
  );

  return (
    <>
      <PageHeader
        title="Contact & site settings"
        description="Company contact info, social links, and default SEO for the public site."
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : error || !data ? (
        <ErrorNote>{error ?? "Couldn't load settings."}</ErrorNote>
      ) : (
        <SettingsForm initial={data} />
      )}
    </>
  );
}

function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [companyName, setCompanyName] = useState(initial.companyName ?? "");
  const [tagline, setTagline] = useState(initial.tagline ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [links, setLinks] = useState<LinkRow[]>(toLinkRows(initial.socialLinks));
  const [metaTitle, setMetaTitle] = useState(initial.seo?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial.seo?.metaDescription ?? "");
  const [ogImage, setOgImage] = useState(initial.seo?.ogImage ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    setSaved(false);

    const socialLinks = links
      .map((l) => ({ kind: l.kind.trim(), label: l.label.trim(), href: l.href.trim() }))
      .filter((l) => l.kind && l.label && l.href);

    const seo =
      metaTitle || metaDescription || ogImage
        ? {
            metaTitle: metaTitle || undefined,
            metaDescription: metaDescription || undefined,
            ogImage: ogImage || undefined,
          }
        : undefined;

    const payload = {
      companyName,
      tagline: tagline || undefined,
      email: email || undefined,
      phone: phone || undefined,
      whatsapp: whatsapp || undefined,
      address: address || undefined,
      socialLinks,
      seo,
    };

    try {
      await api.patch<SiteSettings>("/admin/settings", payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setError("Failed to save.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Company
        </h2>
        <Field label="Company name" htmlFor="companyName" required error={fieldErrors.companyName}>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </Field>
        <Field label="Tagline" htmlFor="tagline" error={fieldErrors.tagline}>
          <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="email" error={fieldErrors.email}>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Phone" htmlFor="phone" error={fieldErrors.phone}>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp" error={fieldErrors.whatsapp} hint="Number or wa.me link.">
            <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
          <Field label="Address" htmlFor="address" error={fieldErrors.address}>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Social links
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setLinks((rows) => [...rows, { key: nextKey(), kind: "", label: "", href: "" }])
            }
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add link
          </Button>
        </div>
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No social links. Add LinkedIn, Instagram, WhatsApp, etc.
          </p>
        ) : (
          links.map((l, i) => (
            <div key={l.key} className="flex items-end gap-2">
              <Field label="Kind" htmlFor={`link-kind-${l.key}`} className="w-32">
                <Input
                  id={`link-kind-${l.key}`}
                  value={l.kind}
                  placeholder="linkedin"
                  onChange={(e) =>
                    setLinks((rows) => rows.map((r, j) => (j === i ? { ...r, kind: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label="Label" htmlFor={`link-label-${l.key}`} className="flex-1">
                <Input
                  id={`link-label-${l.key}`}
                  value={l.label}
                  placeholder="LinkedIn"
                  onChange={(e) =>
                    setLinks((rows) => rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label="URL / href" htmlFor={`link-href-${l.key}`} className="flex-[2]">
                <Input
                  id={`link-href-${l.key}`}
                  value={l.href}
                  placeholder="https://linkedin.com/company/…"
                  onChange={(e) =>
                    setLinks((rows) => rows.map((r, j) => (j === i ? { ...r, href: e.target.value } : r)))
                  }
                />
              </Field>
              <button
                type="button"
                onClick={() => setLinks((rows) => rows.filter((_, j) => j !== i))}
                className="mb-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Default SEO
        </h2>
        <Field label="Meta title" htmlFor="metaTitle" hint="Site-wide default title.">
          <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </Field>
        <Field label="Meta description" htmlFor="metaDescription">
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </Field>
        <Field label="OG image URL" htmlFor="ogImage" hint="Default social share image.">
          <Input
            id="ogImage"
            type="url"
            value={ogImage}
            placeholder="https://res.cloudinary.com/…"
            onChange={(e) => setOgImage(e.target.value)}
          />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner /> : null}
          Save settings
        </Button>
        {saved ? <span className="text-sm text-[var(--success)]">Saved.</span> : null}
      </div>
    </form>
  );
}
