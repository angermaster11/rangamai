"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  ErrorNote,
  Spinner,
} from "@/components/ui";

type Mode = { kind: "create" } | { kind: "edit"; client: Client };

/** Shared create/edit form for a Client. */
export function ClientForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const existing = mode.kind === "edit" ? mode.client : null;

  const [companyName, setCompanyName] = useState(existing?.companyName ?? "");
  const [website, setWebsite] = useState(existing?.website ?? "");
  const [industry, setIndustry] = useState(existing?.industry ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [logoUrl, setLogoUrl] = useState(existing?.logo?.url ?? "");
  const [logoAlt, setLogoAlt] = useState(existing?.logo?.alt ?? "");
  const [showPublicly, setShowPublicly] = useState(existing?.showPublicly ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const payload = {
      companyName,
      website: website || undefined,
      industry: industry || undefined,
      description: description || undefined,
      logo: logoUrl ? { url: logoUrl, alt: logoAlt || companyName } : undefined,
      showPublicly,
    };

    try {
      if (existing) {
        await api.patch<Client>(`/admin/clients/${existing.id}`, payload);
      } else {
        await api.post<Client>("/admin/clients", payload);
      }
      router.push("/clients");
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
        <Field label="Company name" htmlFor="companyName" required error={fieldErrors.companyName}>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Website" htmlFor="website" error={fieldErrors.website}>
            <Input
              id="website"
              type="url"
              value={website}
              placeholder="https://…"
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Field>
          <Field label="Industry" htmlFor="industry" error={fieldErrors.industry}>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </Field>
        </div>
        <Field label="Description" htmlFor="description" error={fieldErrors.description}>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Logo
        </h2>
        <Field label="Logo URL" htmlFor="logoUrl" hint="Paste a URL from the Media library.">
          <Input
            id="logoUrl"
            type="url"
            value={logoUrl}
            placeholder="https://res.cloudinary.com/…"
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </Field>
        <Field label="Alt text" htmlFor="logoAlt" hint="Defaults to the company name if blank.">
          <Input id="logoAlt" value={logoAlt} onChange={(e) => setLogoAlt(e.target.value)} />
        </Field>
      </Card>

      <Card>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showPublicly}
            onChange={(e) => setShowPublicly(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Show publicly under &ldquo;Trusted By&rdquo;
        </label>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner /> : null}
          {existing ? "Save changes" : "Create client"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/clients")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
