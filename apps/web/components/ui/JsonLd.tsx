/**
 * Renders a JSON-LD structured-data script tag. Server component — the JSON
 * is serialized at render time. Pass any schema.org object (or array).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; data is server-controlled.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
