import type { Client } from "@rangamai/shared";
import { Container } from "@/components/ui/Container";

/**
 * "Trusted By" — public client names. Text-based logo placeholders for now
 * (real logos arrive via Cloudinary in a later phase).
 */
export function TrustedBy({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null;

  return (
    <section className="py-14">
      <Container>
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by teams building serious products
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {clients.map((client) => (
            <li
              key={client.id}
              className="font-display text-lg font-semibold text-foreground/70 transition-colors hover:text-foreground"
              title={client.description ?? client.companyName}
            >
              {client.companyName}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
