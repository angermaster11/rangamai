"use client";

import { useState } from "react";
import { LogOut, Menu, ExternalLink } from "lucide-react";
import type { AdminUser } from "@rangamai/shared";
import { api } from "@/lib/api";
import { Button, Spinner } from "@/components/ui";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function Topbar({
  user,
  onToggleSidebar,
}: {
  user: AdminUser;
  onToggleSidebar: () => void;
}) {
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the request fails, clear the client view by navigating.
    }
    // Hard navigation on purpose: drops all client state and forces the
    // middleware auth check to re-run against the now-cleared cookie.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display text-sm font-bold tracking-tight">
          RANGAM<span className="text-accent">AI</span>
          <span className="ml-1.5 font-sans font-normal text-muted-foreground">Admin</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          View site
        </a>
        <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
        <Button variant="ghost" size="sm" onClick={logout} disabled={loggingOut}>
          {loggingOut ? <Spinner /> : <LogOut className="h-4 w-4" aria-hidden />}
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
