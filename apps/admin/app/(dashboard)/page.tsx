"use client";

import Link from "next/link";
import { Inbox, Wrench, FolderKanban, Building2, Image as ImageIcon } from "lucide-react";
import type { AdminStats, Lead } from "@rangamai/shared";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PageHeader } from "@/components/PageHeader";
import { Card, Spinner, ErrorNote, Badge, EmptyState } from "@/components/ui";
import { LEAD_STATUS_TONE } from "@/lib/leadStatus";

export default function DashboardPage() {
  const stats = useAsync<AdminStats>(() => api.get<AdminStats>("/admin/stats"), []);
  const recent = useAsync<Lead[]>(() => api.get<Lead[]>("/admin/stats/recent-leads"), []);

  return (
    <>
      <PageHeader title="Dashboard" description="A quick pulse on content and incoming leads." />

      {stats.error ? <ErrorNote>{stats.error}</ErrorNote> : null}

      {stats.loading || !stats.data ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            icon={<Inbox className="h-4 w-4 text-accent" />}
            label="Total leads"
            value={stats.data.totalLeads}
            sub={`${stats.data.newLeads} new`}
            href="/leads"
          />
          <StatCard
            icon={<Wrench className="h-4 w-4 text-accent" />}
            label="Services"
            value={stats.data.totalServices}
            sub={`${stats.data.publishedServices} published`}
            href="/services"
          />
          <StatCard
            icon={<FolderKanban className="h-4 w-4 text-accent" />}
            label="Projects"
            value={stats.data.totalProjects}
            sub={`${stats.data.publishedProjects} published`}
            href="/projects"
          />
          <StatCard
            icon={<Building2 className="h-4 w-4 text-accent" />}
            label="Clients"
            value={stats.data.totalClients}
            href="/clients"
          />
          <StatCard
            icon={<ImageIcon className="h-4 w-4 text-accent" />}
            label="Media"
            value={stats.data.totalMedia}
            href="/media"
          />
        </div>
      )}

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent leads</h2>
          <Link href="/leads" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>

        {recent.loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-5 w-5 text-accent" />
          </div>
        ) : recent.error ? (
          <ErrorNote>{recent.error}</ErrorNote>
        ) : !recent.data?.length ? (
          <EmptyState title="No leads yet" description="Submissions from the contact form will appear here." />
        ) : (
          <Card className="divide-y divide-border p-0">
            {recent.data.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{lead.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{lead.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {lead.service ? (
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {lead.service}
                    </span>
                  ) : null}
                  <Badge tone={LEAD_STATUS_TONE[lead.status]}>{lead.status}</Badge>
                </div>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:border-accent/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {label}
        </div>
        <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
        {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
      </Card>
    </Link>
  );
}
