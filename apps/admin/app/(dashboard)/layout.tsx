"use client";

import { useEffect, useState } from "react";
import type { AdminUser } from "@rangamai/shared";
import { api, ApiError } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Protected shell. The edge middleware already bounced anyone without a cookie;
 * here we do the authoritative check by calling /auth/me. On 401 (expired or
 * forged cookie) we redirect to login. While checking, we render a spinner so
 * protected content never flashes.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<AdminUser>("/auth/me")
      .then((u) => {
        if (active) {
          setUser(u);
          setChecking(false);
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          // Hard navigation: fully reset client state on an expired/forged cookie.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.assign("/login");
        } else if (active) {
          // API unreachable etc. — still stop the spinner so we can show a note.
          setChecking(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-6 w-6 text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <p className="font-medium">Can&apos;t reach the API.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Make sure the backend is running on :4000, then reload.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar user={user} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar — static on desktop, slide-over on mobile */}
        <aside className="hidden w-60 shrink-0 border-r border-border md:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            <div className="absolute left-0 top-0 h-full w-64 border-r border-border bg-background shadow-xl">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className={cn("min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8")}>{children}</main>
      </div>
    </div>
  );
}
