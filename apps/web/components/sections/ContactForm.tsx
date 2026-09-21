"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Service } from "@rangamai/shared";
import { Button } from "@/components/ui/Button";

type FieldErrors = Partial<Record<string, string[]>>;
type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const BUDGETS = ["< ₹2L", "₹2L – ₹5L", "₹5L – ₹15L", "₹15L+", "Not sure yet"];

/**
 * Contact form. Posts to /api/contact, which validates + rate-limits (dev
 * stub). Shows real per-field errors and a genuine success state — no faked
 * submission. `services` populates the dropdown from content.
 */
export function ContactForm({ services }: { services: Service[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setFormError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      setStatus("error");
      if (json.fieldErrors) setErrors(json.fieldErrors);
      setFormError(json.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setFormError("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          Thanks — we've got your message.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll get back to you shortly. For anything urgent, reach us on
          WhatsApp or email.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </p>
      ) : null}

      <Field label="Name" name="name" errors={errors.name} required>
        <input id="name" name="name" type="text" autoComplete="name" className={inputBase} required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" errors={errors.email} required>
          <input id="email" name="email" type="email" autoComplete="email" className={inputBase} required />
        </Field>
        <Field label="Phone" name="phone" errors={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputBase} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company" name="company" errors={errors.company}>
          <input id="company" name="company" type="text" autoComplete="organization" className={inputBase} />
        </Field>
        <Field label="Service" name="service" errors={errors.service}>
          <select id="service" name="service" className={inputBase} defaultValue="">
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
            <option value="other">Something else</option>
          </select>
        </Field>
      </div>

      <Field label="Budget" name="budgetRange" errors={errors.budgetRange}>
        <select id="budgetRange" name="budgetRange" className={inputBase} defaultValue="">
          <option value="">Select a range (optional)</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" name="message" errors={errors.message} required>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={inputBase}
          placeholder="Tell us what you're trying to build."
          required
        />
      </Field>

      {/* Honeypot: hidden from real users, catches bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Do not fill this in
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

/** Labelled field wrapper with inline validation error. */
function Field({
  label,
  name,
  errors,
  required,
  children,
}: {
  label: string;
  name: string;
  errors?: string[];
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {children}
      {errors?.length ? (
        <p className="mt-1.5 text-sm text-destructive">{errors[0]}</p>
      ) : null}
    </div>
  );
}
