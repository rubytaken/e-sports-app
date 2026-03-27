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
          <div key={i} className="h-8 w-20 rounded-full skeleton-shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={clearGame}
        className={cn(
          "tab-pill",
          !activeGame && "tab-pill-active"
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
              "tab-pill",
              active && "tab-pill-active"
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
