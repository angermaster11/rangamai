"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { Client } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PageHeader } from "@/components/PageHeader";
import {
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  ErrorNote,
  Spinner,
} from "@/components/ui";

export default function ClientsPage() {
  const { data, loading, error, reload, setData } = useAsync<Client[]>(
    () => api.get<Client[]>("/admin/clients"),
    [],
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function togglePublic(c: Client) {
    setBusy(c.id);
    setActionError(null);
    try {
      const updated = await api.patch<Client>(`/admin/clients/${c.id}`, {
        showPublicly: !c.showPublicly,
      });
      setData((prev) => (prev ?? []).map((x) => (x.id === c.id ? updated : x)));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Update failed.");
    } finally {
      setBusy(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!data) return;
    const target = index + dir;
    if (target < 0 || target >= data.length) return;
    const reordered = [...data];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setData(reordered);
    setActionError(null);
    try {
      await api.post("/admin/clients/reorder", { ids: reordered.map((x) => x.id) });
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Reorder failed.");
      reload();
    }
  }

  async function remove(c: Client) {
    if (!confirm(`Delete "${c.companyName}"? This can't be undone.`)) return;
    setBusy(c.id);
    try {
      await api.delete(`/admin/clients/${c.id}`);
      setData((prev) => (prev ?? []).filter((x) => x.id !== c.id));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Clients"
        description="Partners and logos. Publicly shown ones appear under “Trusted By”."
        actions={
          <ButtonLink href="/clients/new" size="sm">
            <Plus className="h-4 w-4" aria-hidden />
            New client
          </ButtonLink>
        }
      />

      {error ? <ErrorNote>{error}</ErrorNote> : null}
      {actionError ? <ErrorNote>{actionError}</ErrorNote> : null}

      {loading && !data ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : !data?.length ? (
        <EmptyState
          title="No clients yet"
          description="Add your first client or partner."
          action={
            <ButtonLink href="/clients/new" size="sm">
              <Plus className="h-4 w-4" aria-hidden />
              New client
            </ButtonLink>
          }
        />
      ) : (
        <Card className="divide-y divide-border p-0">
          {data.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${c.companyName} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === data.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${c.companyName} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">{c.companyName}</p>
                  {c.showPublicly ? <Badge tone="success">Public</Badge> : <Badge>Hidden</Badge>}
                </div>
                {c.industry ? (
                  <p className="truncate text-sm text-muted-foreground">{c.industry}</p>
                ) : null}
              </div>

              <button
                onClick={() => togglePublic(c)}
                disabled={busy === c.id}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                aria-label={c.showPublicly ? "Hide from site" : "Show on site"}
                title={c.showPublicly ? "Shown under Trusted By" : "Hidden"}
              >
                {c.showPublicly ? (
                  <Eye className="h-4 w-4" aria-hidden />
                ) : (
                  <EyeOff className="h-4 w-4" aria-hidden />
                )}
              </button>

              <Link
                href={`/clients/${c.id}`}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                aria-label={`Edit ${c.companyName}`}
              >
                <Pencil className="h-4 w-4" />
              </Link>

              <button
                onClick={() => remove(c)}
                disabled={busy === c.id}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label={`Delete ${c.companyName}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
