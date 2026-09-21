"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Service } from "@rangamai/shared";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PageHeader } from "@/components/PageHeader";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { Spinner, ErrorNote } from "@/components/ui";

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useAsync<Service>(
    () => api.get<Service>(`/admin/services/${id}`),
    [id],
  );

  return (
    <>
      <Link
        href="/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to services
      </Link>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : error || !data ? (
        <ErrorNote>{error ?? "Service not found."}</ErrorNote>
      ) : (
        <>
          <PageHeader title={`Edit: ${data.title}`} />
          <ServiceForm mode={{ kind: "edit", service: data }} />
        </>
      )}
    </>
  );
}
