"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Mail, Phone, Building2 } from "lucide-react";
import type { Lead, LeadStatus } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { LEAD_STATUSES, LEAD_STATUS_TONE } from "@/lib/leadStatus";
import { PageHeader } from "@/components/PageHeader";
import {
  Badge,
  Button,
  Card,
  ErrorNote,
  Field,
  Select,
  Spinner,
  Textarea,
} from "@/components/ui";

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error, setData } = useAsync<Lead>(
    () => api.get<Lead>(`/admin/leads/${id}`),
    [id],
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  async function remove() {
    if (!confirm("Delete this lead permanently? This can't be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/leads/${id}`);
      router.push("/leads");
    } catch (err) {
      setDeleteErr(err instanceof ApiError ? err.message : "Failed to delete.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-accent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <>
        <BackLink />
        <ErrorNote>{error ?? "Lead not found."}</ErrorNote>
      </>
    );
  }

  return (
    <>
      <BackLink />
      <PageHeader
        title={data.name}
        actions={
          <Button variant="danger" size="sm" onClick={remove} disabled={deleting}>
            {deleting ? <Spinner /> : <Trash2 className="h-4 w-4" aria-hidden />}
            Delete
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Message
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {data.message}
            </p>
          </Card>

          {/* Seeded from the loaded lead — key remounts it if a new lead loads. */}
          <LeadManager
            key={data.id}
            id={id}
            lead={data}
            onSaved={(updated) => setData(updated)}
          />
        </div>

        <div className="space-y-5">
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge tone={LEAD_STATUS_TONE[data.status]}>{data.status}</Badge>
            </div>
            <DetailRow icon={<Mail className="h-4 w-4" />} label="Email">
              <a href={`mailto:${data.email}`} className="text-accent hover:underline">
                {data.email}
              </a>
            </DetailRow>
            {data.phone ? (
              <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone">
                <a href={`tel:${data.phone}`} className="text-accent hover:underline">
                  {data.phone}
                </a>
              </DetailRow>
            ) : null}
            {data.company ? (
              <DetailRow icon={<Building2 className="h-4 w-4" />} label="Company">
                {data.company}
              </DetailRow>
            ) : null}
          </Card>

          <Card className="space-y-2 text-sm">
            <MetaRow label="Service" value={data.service} />
            <MetaRow label="Budget" value={data.budgetRange} />
            <MetaRow label="Project type" value={data.projectType} />
            <MetaRow label="Source" value={data.source} />
            <MetaRow
              label="Received"
              value={data.createdAt ? new Date(data.createdAt).toLocaleString() : undefined}
            />
          </Card>
        </div>
      </div>

      {deleteErr ? <ErrorNote>{deleteErr}</ErrorNote> : null}
    </>
  );
}

/** Status + notes editor, seeded once from the loaded lead (no sync effect). */
function LeadManager({
  id,
  lead,
  onSaved,
}: {
  id: string;
  lead: Lead;
  onSaved: (updated: Lead) => void;
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const dirty = status !== lead.status || notes !== (lead.notes ?? "");

  async function save() {
    setSaving(true);
    setSaveMsg(null);
    setSaveErr(null);
    try {
      const updated = await api.patch<Lead>(`/admin/leads/${id}`, { status, notes });
      onSaved(updated);
      setSaveMsg("Saved.");
    } catch (err) {
      setSaveErr(err instanceof ApiError ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-4">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Manage
      </h2>
      {saveErr ? <ErrorNote>{saveErr}</ErrorNote> : null}
      <Field label="Status" htmlFor="status">
        <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Internal notes" htmlFor="notes" hint="Only visible here, never to the lead.">
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add context, next steps, call outcomes…"
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? <Spinner /> : null}
          Save changes
        </Button>
        {saveMsg ? <span className="text-sm text-[var(--success)]">{saveMsg}</span> : null}
      </div>
    </Card>
  );
}

function BackLink() {
  return (
    <Link
      href="/leads"
      className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back to leads
    </Link>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground" aria-hidden>
        {icon}
      </span>
      <span className="sr-only">{label}: </span>
      <span className="truncate text-foreground">{children}</span>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right text-foreground">{value || "—"}</span>
    </div>
  );
}
