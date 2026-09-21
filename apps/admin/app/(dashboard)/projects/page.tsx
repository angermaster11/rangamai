"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowUp, ArrowDown, Star, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@rangamai/shared";
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

export default function ProjectsPage() {
  const { data, loading, error, reload, setData } = useAsync<Project[]>(
    () => api.get<Project[]>("/admin/projects"),
    [],
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function toggleFeatured(p: Project) {
    setBusy(p.id);
    setActionError(null);
    try {
      const updated = await api.patch<Project>(`/admin/projects/${p.id}`, {
        featured: !p.featured,
      });
      setData((prev) => (prev ?? []).map((x) => (x.id === p.id ? updated : x)));
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
      await api.post("/admin/projects/reorder", { ids: reordered.map((x) => x.id) });
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Reorder failed.");
      reload();
    }
  }

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    setBusy(p.id);
    try {
      await api.delete(`/admin/projects/${p.id}`);
      setData((prev) => (prev ?? []).filter((x) => x.id !== p.id));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Showcase"
        description="Case studies and portfolio projects. Order here controls order on the site."
        actions={
          <ButtonLink href="/projects/new" size="sm">
            <Plus className="h-4 w-4" aria-hidden />
            New project
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
          title="No projects yet"
          description="Add your first case study."
          action={
            <ButtonLink href="/projects/new" size="sm">
              <Plus className="h-4 w-4" aria-hidden />
              New project
            </ButtonLink>
          }
        />
      ) : (
        <Card className="divide-y divide-border p-0">
          {data.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${p.title} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === data.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${p.title} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">{p.title}</p>
                  {!p.published ? <Badge>Draft</Badge> : null}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  /{p.slug}
                  {p.client ? ` · ${p.client}` : ""}
                </p>
              </div>

              <button
                onClick={() => toggleFeatured(p)}
                disabled={busy === p.id}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                aria-label={p.featured ? "Unfeature" : "Feature"}
                title={p.featured ? "Featured on homepage" : "Not featured"}
              >
                <Star
                  className={p.featured ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4"}
                  aria-hidden
                />
              </button>

              <Link
                href={`/projects/${p.id}`}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                aria-label={`Edit ${p.title}`}
              >
                <Pencil className="h-4 w-4" />
              </Link>

              <button
                onClick={() => remove(p)}
                disabled={busy === p.id}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label={`Delete ${p.title}`}
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
