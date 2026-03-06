"use client";

import { useVideogames } from "@/lib/api/videogames";
import { useGameFilter } from "@/hooks/use-game-filter";
import { cn } from "@/lib/utils";

export function GameFilter() {
  const { data: games, isLoading } = useVideogames();
  const { activeGame, setGame, clearGame } = useGameFilter();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-16 rounded-md bg-surface-2 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={clearGame}
        className={cn(
          "rounded-md px-3 py-1 text-xs font-medium transition-colors",
          !activeGame
            ? "bg-accent text-surface-0"
            : "bg-surface-2 text-text-2 hover:text-text-1"
        )}
      >
        All
      </button>
      {games?.map((game) => (
        <button
          key={game.id}
          onClick={() => setGame(game.slug)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            activeGame === game.slug
              ? "bg-accent text-surface-0"
              : "bg-surface-2 text-text-2 hover:text-text-1"
          )}
        >
          {game.name}
        </button>
      ))}
    </div>
  );
}
