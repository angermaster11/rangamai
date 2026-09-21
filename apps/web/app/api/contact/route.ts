import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Contact / lead endpoint.
 *
 * DEV-PHASE STUB — this validates and rate-limits the request and returns
 * proper success/error JSON, but it does NOT yet persist to MongoDB or send
 * email. In a later phase the marked TODO forwards the validated lead to the
 * NestJS API (which stores it and triggers Resend). The validation shape here
 * matches the future `LeadInput` contract so nothing about the client changes.
 */

export const runtime = "nodejs";

/** Validation schema — mirrors the shared `LeadInput` type. */
const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(4000),
  /**
   * Honeypot — real users never fill this. Accepted by the schema (any value)
   * so a filled field passes validation and is then dropped silently below,
   * rather than returning a 422 that would reveal the trap to bots.
   */
  website: z.string().max(200).optional(),
});

/* --------------------------- Rate limiting ---------------------------- */
/**
 * Simple in-memory, per-IP fixed-window limiter (no Redis this phase, per
 * spec §10). Fine for a single dev instance; a shared store replaces it when
 * the real backend lands.
 */
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return NextResponse.json(
      { ok: false, error: "Please fix the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot tripped — pretend success, drop silently.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  // TODO (backend phase): forward the validated lead to the NestJS API, which
  // persists it to MongoDB and sends a notification via Resend. Never store or
  // email secrets; the API base URL comes from NEXT_PUBLIC_API_URL / server env.
  // For now we just log server-side so the flow is observable in dev.
  const { website: _hp, ...lead } = parsed.data;
  console.info("[contact] lead received (dev stub, not persisted):", {
    name: lead.name,
    email: lead.email,
    service: lead.service || "(unspecified)",
  });

  return NextResponse.json({ ok: true });
}
