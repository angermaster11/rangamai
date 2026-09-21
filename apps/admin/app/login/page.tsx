"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { AdminUser } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { Button, Card, Field, Input, ErrorNote, Spinner } from "@/components/ui";

export default function LoginPage() {
  // useSearchParams() bails out of prerendering, so it must sit under Suspense.
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <Spinner className="h-6 w-6 text-accent" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await api.post<AdminUser>("/auth/login", { email, password });
      // Cookie is set by the API; a full navigation lets middleware see it.
      window.location.assign(nextPath);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden />
            RANGAM<span className="text-accent">AI</span>
          </span>
          <p className="mt-1 text-sm text-muted-foreground">Admin dashboard</p>
        </div>

        <Card>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {error ? <ErrorNote>{error}</ErrorNote> : null}

            <Field label="Email" htmlFor="email" required error={fieldErrors.email}>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </Field>

            <Field label="Password" htmlFor="password" required error={fieldErrors.password}>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Spinner /> : null}
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Authorized personnel only.
        </p>
      </div>
    </main>
  );
}
