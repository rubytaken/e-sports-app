"use client";

import { useVideogames } from "@/lib/api/videogames";
import { useGameFilter } from "@/hooks/use-game-filter";
import { cn } from "@/lib/utils";
import { GameIcon } from "@/components/shared/game-icon";

export function GameFilter() {
  const { data: games, isLoading } = useVideogames();
  const { activeGame, setGame, clearGame } = useGameFilter();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-lg skeleton-shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={clearGame}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
          !activeGame
            ? "game-tab-active border-accent/20"
            : "border-border bg-surface-1 text-text-2 hover:text-text-1 hover:border-border-hover"
        )}
      >
        <GameIcon slug="generic" size={13} />
        All
      </button>
      {games?.map((game) => {
        const active = activeGame === game.slug;
        return (
          <button
            key={game.id}
            onClick={() => setGame(game.slug)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              active
                ? "game-tab-active border-accent/20"
                : "border-border bg-surface-1 text-text-2 hover:text-text-1 hover:border-border-hover"
            )}
          >
            <GameIcon slug={game.slug} size={13} />
            {game.name}
          </button>
        );
      })}
    </div>
  );
}
