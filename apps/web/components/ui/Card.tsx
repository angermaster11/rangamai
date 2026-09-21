import { cn } from "@/lib/cn";

/** Base surface card. Set `interactive` for hover lift on linked cards. */
export function Card({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 text-card-foreground",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      {children}
    </div>
  );
}
