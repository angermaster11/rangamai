"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ClientForm } from "@/components/forms/ClientForm";

export default function NewClientPage() {
  return (
    <>
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to clients
      </Link>
      <PageHeader title="New client" />
      <ClientForm mode={{ kind: "create" }} />
    </>
  );
}
