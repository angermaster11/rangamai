"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProjectForm } from "@/components/forms/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to showcase
      </Link>
      <PageHeader title="New project" />
      <ProjectForm mode={{ kind: "create" }} />
    </>
  );
}
