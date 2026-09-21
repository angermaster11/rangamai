import { NextResponse } from "next/server";
import { z } from "zod";
import { API_URL } from "@/lib/api";

/**
 * Contact / lead endpoint (server-side proxy).
 *
 * Validates + honeypot-checks + rate-limits the submission, then forwards the
 * clean lead to the NestJS API's `POST /leads` server-to-server (the browser
 * never sees the API URL or talks to it directly). The API persists the lead
 * to MongoDB; email notification is an honest dev-log stub there (no provider
 * configured yet). Falls back to a logged no-op if the API isn't configured.
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

  // Forward the validated lead to the NestJS API (server-to-server, so the API
  // URL and CORS are never exposed to the browser). The API persists it to
  // MongoDB and fires its (stubbed) notification. `website` (honeypot) and any
  // empty optional strings are stripped so we send a clean LeadInput.
  const { website: _hp, ...clean } = parsed.data;
  void _hp;
  const payload = Object.fromEntries(
    Object.entries(clean).filter(([, v]) => v !== undefined && v !== ""),
  );

  if (!API_URL) {
    // No backend configured — log so dev flow is observable, still succeed.
    console.info("[contact] lead received (API not configured, not persisted):", {
      name: parsed.data.name,
      email: parsed.data.email,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`${API_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 429) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again in a minute." },
        { status: 429 },
      );
    }

    if (!res.ok) {
      // Surface the API's field errors when present (shape matches the client).
      const body = (await res.json().catch(() => null)) as
        | { error?: string; fieldErrors?: Record<string, string[]> }
        | null;
      return NextResponse.json(
        {
          ok: false,
          error: body?.error ?? "Something went wrong. Please try again.",
          ...(body?.fieldErrors ? { fieldErrors: body.fieldErrors } : {}),
        },
        { status: res.status >= 400 && res.status < 500 ? 422 : 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to reach API:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your message right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
