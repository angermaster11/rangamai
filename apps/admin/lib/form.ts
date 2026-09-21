/** Turn a title into a URL-safe kebab-case slug (matches the API's slug rule). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Split a textarea (one item per line) into a trimmed, non-empty string list. */
export function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Join a string list back into a one-per-line textarea value. */
export function listToLines(list?: string[]): string {
  return (list ?? []).join("\n");
}

/** Split a comma-separated field into a trimmed, non-empty list. */
export function csvToList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Join a list into a comma-separated string. */
export function listToCsv(list?: string[]): string {
  return (list ?? []).join(", ");
}
