"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@rangamai/shared";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PageHeader } from "@/components/PageHeader";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Spinner, ErrorNote } from "@/components/ui";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useAsync<Project>(
    () => api.get<Project>(`/admin/projects/${id}`),
    [id],
  );

  return (
    <>
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to showcase
      </Link>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : error || !data ? (
        <ErrorNote>{error ?? "Project not found."}</ErrorNote>
      ) : (
        <>
          <PageHeader title={`Edit: ${data.title}`} />
          <ProjectForm mode={{ kind: "edit", project: data }} />
        </>
      )}
    </>
  );
}
