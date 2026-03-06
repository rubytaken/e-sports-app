"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useGameFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeGame = searchParams.get("game") || "";

  const setGame = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set("game", slug);
      } else {
        params.delete("game");
      }
      // Reset page when filter changes
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const clearGame = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("game");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  return { activeGame, setGame, clearGame };
}
