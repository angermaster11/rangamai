"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Re-run the loader (e.g. after a mutation). */
  reload: () => void;
  /** Optimistically replace the local data without a refetch. */
  setData: (updater: T | ((prev: T | null) => T)) => void;
}

/**
 * Runs an async loader on mount (and on any `deps` change), tracking
 * loading/error/data. `reload()` re-runs it; `setData()` patches locally.
 */
export function useAsync<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList = [],
): AsyncState<T> {
  const [data, setDataState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // The loader closes over caller state; `deps` (not a literal here) tells us
  // when to rebuild it — exactly the escape hatch this generic hook needs.
  // eslint-disable-next-line react-hooks/use-memo
  const stableLoader = useCallback(loader, deps);

  useEffect(() => {
    const controller = new AbortController();
    // Entering the loading state on (re)fetch is the effect's whole purpose;
    // this is a data-fetch effect, not the cascading-render case the rule guards.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    stableLoader(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setDataState(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : "Failed to load data.");
        setLoading(false);
      });
    return () => controller.abort();
  }, [stableLoader, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  const setData = useCallback((updater: T | ((prev: T | null) => T)) => {
    setDataState((prev) =>
      typeof updater === "function" ? (updater as (p: T | null) => T)(prev) : updater,
    );
  }, []);

  return { data, loading, error, reload, setData };
}
