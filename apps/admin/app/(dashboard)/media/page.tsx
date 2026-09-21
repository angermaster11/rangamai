"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Copy, Check, Trash2, Save } from "lucide-react";
import type { Media } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PageHeader } from "@/components/PageHeader";
import {
  Button,
  Card,
  Input,
  EmptyState,
  ErrorNote,
  Spinner,
} from "@/components/ui";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const { data, loading, error, setData } = useAsync<Media[]>(
    () => api.get<Media[]>("/admin/media"),
    [],
  );
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    setActionError(null);

    for (const file of Array.from(files)) {
      if (!ALLOWED.includes(file.type)) {
        setActionError(`"${file.name}" isn't a supported image (jpg, png, webp, avif, gif).`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setActionError(`"${file.name}" is over 5 MB.`);
        continue;
      }
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("alt", "");
        const created = await api.upload<Media>("/admin/media", form);
        setData((prev) => [created, ...(prev ?? [])]);
      } catch (err) {
        setActionError(
          err instanceof ApiError ? err.message : `Upload of "${file.name}" failed.`,
        );
      } finally {
        setUploading(false);
      }
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  async function copyUrl(m: Media) {
    try {
      await navigator.clipboard.writeText(m.url);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId((id) => (id === m.id ? null : id)), 1500);
    } catch {
      setActionError("Couldn't copy to clipboard.");
    }
  }

  async function remove(m: Media) {
    if (!confirm("Delete this image? It's removed from Cloudinary too and can't be undone.")) return;
    setActionError(null);
    try {
      await api.delete(`/admin/media/${m.id}`);
      setData((prev) => (prev ?? []).filter((x) => x.id !== m.id));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Delete failed.");
    }
  }

  return (
    <>
      <PageHeader
        title="Media"
        description="Upload images to Cloudinary, then paste their URL into services, projects, or clients."
        actions={
          <Button
            size="sm"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Spinner /> : <Upload className="h-4 w-4" aria-hidden />}
            Upload
          </Button>
        }
      />

      <input
        ref={fileInput}
        type="file"
        accept={ALLOWED.join(",")}
        multiple
        className="hidden"
        onChange={(e) => onFilesSelected(e.target.files)}
      />

      {error ? <ErrorNote>{error}</ErrorNote> : null}
      {actionError ? <ErrorNote>{actionError}</ErrorNote> : null}

      {loading && !data ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      ) : !data?.length ? (
        <EmptyState
          title="No media yet"
          description="Upload your first image. Max 5 MB, JPG / PNG / WebP / AVIF / GIF."
          action={
            <Button size="sm" onClick={() => fileInput.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" aria-hidden />
              Upload
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((m) => (
            <MediaCard
              key={m.id}
              media={m}
              copied={copiedId === m.id}
              onCopy={() => copyUrl(m)}
              onRemove={() => remove(m)}
              onAltSaved={(updated) =>
                setData((prev) => (prev ?? []).map((x) => (x.id === updated.id ? updated : x)))
              }
              onError={setActionError}
            />
          ))}
        </div>
      )}
    </>
  );
}

function MediaCard({
  media,
  copied,
  onCopy,
  onRemove,
  onAltSaved,
  onError,
}: {
  media: Media;
  copied: boolean;
  onCopy: () => void;
  onRemove: () => void;
  onAltSaved: (m: Media) => void;
  onError: (msg: string) => void;
}) {
  const [alt, setAlt] = useState(media.alt);
  const [saving, setSaving] = useState(false);
  const dirty = alt.trim() !== media.alt;

  async function saveAlt() {
    setSaving(true);
    try {
      const updated = await api.patch<Media>(`/admin/media/${media.id}`, { alt: alt.trim() });
      onAltSaved(updated);
    } catch (err) {
      onError(err instanceof ApiError ? err.message : "Couldn't save alt text.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-2 p-3">
      <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-muted">
        {/* Cloudinary host isn't in next.config images — unoptimized keeps it simple. */}
        <Image
          src={media.url}
          alt={media.alt || "Uploaded media"}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      <p className="truncate text-xs text-muted-foreground" title={media.url}>
        {media.format?.toUpperCase()} · {formatBytes(media.bytes)}
        {media.width ? ` · ${media.width}×${media.height}` : ""}
      </p>

      <div className="flex items-center gap-1.5">
        <Input
          value={alt}
          placeholder="Alt text…"
          onChange={(e) => setAlt(e.target.value)}
          className="h-8 text-xs"
          aria-label="Alt text"
        />
        <button
          onClick={saveAlt}
          disabled={!dirty || saving}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
          aria-label="Save alt text"
          title="Save alt text"
        >
          {saving ? <Spinner /> : <Save className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={onCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden />
              Copy URL
            </>
          )}
        </Button>
        <button
          onClick={onRemove}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
          aria-label="Delete image"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
