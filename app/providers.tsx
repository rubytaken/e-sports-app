"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { LocaleProvider } from "@/hooks/use-locale";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (failureCount >= 3) return false;
              // Extract status from error message if available
              const msg = error instanceof Error ? error.message : "";
              // Don't retry 4xx client errors (except 429 rate limit)
              if (msg.includes("429")) return true;
              if (msg.includes("400") || msg.includes("401") || msg.includes("403") || msg.includes("404") || msg.includes("422")) return false;
              return true;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>{children}</LocaleProvider>
    </QueryClientProvider>
  );
}
