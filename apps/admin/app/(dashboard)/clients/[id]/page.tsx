"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Client } from "@rangamai/shared";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PageHeader } from "@/components/PageHeader";
import { ClientForm } from "@/components/forms/ClientForm";
import { Spinner, ErrorNote } from "@/components/ui";

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useAsync<Client>(
    () => api.get<Client>(`/admin/clients/${id}`),
    [id],
  );

  return (
    <>
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to clients
      </Link>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : error || !data ? (
        <ErrorNote>{error ?? "Client not found."}</ErrorNote>
      ) : (
        <>
          <PageHeader title={`Edit: ${data.companyName}`} />
          <ClientForm mode={{ kind: "edit", client: data }} />
        </>
      )}
    </>
  );
}
