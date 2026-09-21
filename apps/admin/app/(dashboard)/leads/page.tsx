"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { LeadStatus } from "@rangamai/shared";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import type { PaginatedLeads } from "@/lib/types";
import { LEAD_STATUSES, LEAD_STATUS_TONE } from "@/lib/leadStatus";
import { PageHeader } from "@/components/PageHeader";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Input,
  Select,
  Spinner,
} from "@/components/ui";

const LIMIT = 20;

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [page, setPage] = useState(1);

  // Debounce the search box so we don't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (debounced) p.set("search", debounced);
    if (status) p.set("status", status);
    p.set("page", String(page));
    p.set("limit", String(LIMIT));
    return p.toString();
  }, [debounced, status, page]);

  const { data, loading, error } = useAsync<PaginatedLeads>(
    () => api.get<PaginatedLeads>(`/admin/leads?${query}`),
    [query],
  );

  return (
    <>
      <PageHeader
        title="Leads"
        description="Contact-form submissions. Search, filter, and move them through the pipeline."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, email, company, message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search leads"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as LeadStatus | "");
            setPage(1);
          }}
          aria-label="Filter by status"
          className="w-auto"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {error ? <ErrorNote>{error}</ErrorNote> : null}

      {loading && !data ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="No leads found"
          description={
            debounced || status
              ? "Try clearing the search or filter."
              : "Submissions from the public contact form will show up here."
          }
        />
      ) : (
        <>
          <Card className="divide-y divide-border p-0">
            {data.items.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{lead.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {lead.email}
                    {lead.company ? ` · ${lead.company}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""}
                  </span>
                  <Badge tone={LEAD_STATUS_TONE[lead.status]}>{lead.status}</Badge>
                </div>
              </Link>
            ))}
          </Card>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {data.total} lead{data.total === 1 ? "" : "s"} · page {data.page} of {data.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
