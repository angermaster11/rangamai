/**
 * Server-side API client for the public website.
 *
 * Talks to the NestJS API and unwraps the uniform `ApiResponse<T>` envelope.
 * Used only by the content accessors (`lib/content`) and the contact route —
 * never from client components, so the API base URL and cookies stay server-side.
 *
 * When the API is unreachable or returns an error, `apiFetch` throws; callers
 * in `lib/content` catch that and fall back to the bundled seed content, so the
 * site always renders even with the backend down.
 */
import type { ApiResponse } from "@rangamai/shared";

/**
 * Base URL of the API. `API_URL` (server-only) takes precedence;
 * `NEXT_PUBLIC_API_URL` is the shared fallback. Empty string ⇒ API disabled
 * (accessors use seed content directly and never attempt a request).
 */
export const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
).replace(/\/$/, "");

/** Whether an API base is configured at all. */
export const API_ENABLED = API_URL.length > 0;

export interface ApiFetchOptions {
  /** ISR revalidate window in seconds (Next fetch cache). Default 60. */
  revalidate?: number;
  /** Extra fetch init (method, body, headers). */
  init?: RequestInit;
}

/**
 * Fetches `/api{path}` and returns the unwrapped `data`.
 * Throws on network failure, non-2xx, or `{ success: false }`.
 */
export async function apiFetch<T>(
  path: string,
  { revalidate = 60, init }: ApiFetchOptions = {},
): Promise<T> {
  if (!API_ENABLED) {
    throw new Error("API_URL is not configured");
  }

  const url = `${API_URL}/api${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    // ISR: cache the response and revalidate in the background.
    next: { revalidate },
  });

  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !body || body.success !== true) {
    const message = body?.error ?? `API request failed (${res.status})`;
    throw new Error(message);
  }

  return body.data as T;
}
