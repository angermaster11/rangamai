"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowUp, ArrowDown, Star, Pencil, Trash2 } from "lucide-react";
import type { Service } from "@rangamai/shared";
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

export default function ServicesPage() {
  const { data, loading, error, reload, setData } = useAsync<Service[]>(
    () => api.get<Service[]>("/admin/services"),
    [],
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function toggleFeatured(svc: Service) {
    setBusy(svc.id);
    setActionError(null);
    try {
      const updated = await api.patch<Service>(`/admin/services/${svc.id}`, {
        featured: !svc.featured,
      });
      setData((prev) => (prev ?? []).map((s) => (s.id === svc.id ? updated : s)));
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
    setData(reordered); // optimistic
    setActionError(null);
    try {
      await api.post("/admin/services/reorder", { ids: reordered.map((s) => s.id) });
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Reorder failed.");
      reload();
    }
  }

  async function remove(svc: Service) {
    if (!confirm(`Delete "${svc.title}"? This can't be undone.`)) return;
    setBusy(svc.id);
    try {
      await api.delete(`/admin/services/${svc.id}`);
      setData((prev) => (prev ?? []).filter((s) => s.id !== svc.id));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="What RANGAMAI offers. Order here controls order on the site."
        actions={
          <ButtonLink href="/services/new" size="sm">
            <Plus className="h-4 w-4" aria-hidden />
            New service
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
          title="No services yet"
          description="Add your first service offering."
          action={
            <ButtonLink href="/services/new" size="sm">
              <Plus className="h-4 w-4" aria-hidden />
              New service
            </ButtonLink>
          }
        />
      ) : (
        <Card className="divide-y divide-border p-0">
          {data.map((svc, i) => (
            <div key={svc.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${svc.title} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === data.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${svc.title} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">{svc.title}</p>
                  {!svc.published ? <Badge>Draft</Badge> : null}
                </div>
                <p className="truncate text-sm text-muted-foreground">/{svc.slug}</p>
              </div>

              <button
                onClick={() => toggleFeatured(svc)}
                disabled={busy === svc.id}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                aria-label={svc.featured ? "Unfeature" : "Feature"}
                title={svc.featured ? "Featured on homepage" : "Not featured"}
              >
                <Star
                  className={svc.featured ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4"}
                  aria-hidden
                />
              </button>

              <Link
                href={`/services/${svc.id}`}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                aria-label={`Edit ${svc.title}`}
              >
                <Pencil className="h-4 w-4" />
              </Link>

              <button
                onClick={() => remove(svc)}
                disabled={busy === svc.id}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label={`Delete ${svc.title}`}
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
