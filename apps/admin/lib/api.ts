/**
 * Admin API client (browser-side).
 *
 * All calls include the auth cookie (`credentials: "include"`) — the API set
 * an HttpOnly cookie at login, scoped to localhost, so it's sent across the
 * :3001 → :4000 same-site boundary. Responses use the uniform ApiResponse
 * envelope; this unwraps `data` and throws a typed `ApiError` otherwise so
 * callers can show `error` / `fieldErrors`.
 */
import type { ApiResponse } from "@rangamai/shared";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

/** Error carrying the API's message + optional per-field validation errors. */
export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;
  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** JSON body — serialized automatically. Omit for GET/DELETE. */
  body?: unknown;
  /** For multipart uploads: a FormData body (Content-Type is left to the browser). */
  formData?: FormData;
  signal?: AbortSignal;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}/api${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;

  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? "GET",
      headers,
      body,
      credentials: "include",
      cache: "no-store",
      signal: opts.signal,
    });
  } catch {
    throw new ApiError("Can't reach the API. Is it running on :4000?", 0);
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !json || json.success !== true) {
    throw new ApiError(
      json?.error ?? `Request failed (${res.status})`,
      res.status,
      json?.fieldErrors,
    );
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", formData }),
};
