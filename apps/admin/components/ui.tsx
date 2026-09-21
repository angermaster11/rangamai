/**
 * Admin UI primitives — small, unstyled-to-token building blocks reused across
 * every management screen. Ink & Amber tokens, dense layout, a11y-first
 * (labels, focus rings, disabled states).
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

/* --------------------------------- Button -------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

const btnVariants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
  ghost: "text-foreground hover:bg-muted",
  accent: "bg-accent text-accent-foreground hover:opacity-90",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90",
};

const btnSizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...rest} />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  href: string;
} & React.ComponentProps<typeof Link>) {
  return (
    <Link className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...rest} />
  );
}

/* ---------------------------------- Card --------------------------------- */

export function Card({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-card p-5", className)}
      {...rest}
    />
  );
}

/* -------------------------------- Form bits ------------------------------ */

export function Label({
  className,
  children,
  required,
  ...rest
}: { required?: boolean } & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-foreground", className)} {...rest}>
      {children}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </label>
  );
}

const fieldBase =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50";

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...rest} />;
}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24 resize-y", className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "cursor-pointer", className)} {...rest}>
      {children}
    </select>
  );
}

/** A labelled field wrapper with optional inline error + hint. */
export function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string[];
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error?.length ? (
        <p className="text-xs text-destructive">{error.join(" ")}</p>
      ) : null}
    </div>
  );
}

/* --------------------------------- Badge --------------------------------- */

export function Badge({
  className,
  tone = "muted",
  children,
}: {
  className?: string;
  tone?: "muted" | "accent" | "success" | "danger";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    accent: "bg-secondary text-secondary-foreground",
    success: "bg-[color-mix(in_srgb,var(--success)_18%,transparent)] text-[var(--success)]",
    danger: "bg-[color-mix(in_srgb,var(--destructive)_15%,transparent)] text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------ Feedback bits ---------------------------- */

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-destructive/40 bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] px-3 py-2 text-sm text-destructive">
      {children}
    </div>
  );
}
