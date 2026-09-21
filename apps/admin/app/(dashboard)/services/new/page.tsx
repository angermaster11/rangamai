"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ServiceForm } from "@/components/forms/ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <Link
        href="/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to services
      </Link>
      <PageHeader title="New service" />
      <ServiceForm mode={{ kind: "create" }} />
    </>
  );
}
