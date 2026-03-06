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
            retry: 2,
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
