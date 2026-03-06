"use client";

import { useVideogames } from "@/lib/api/videogames";
import { useGameFilter } from "@/hooks/use-game-filter";
import { cn } from "@/lib/utils";
import { Gamepad2, Crosshair, Swords, Target, Bomb, Rocket, Wand2, Crown, Joystick } from "lucide-react";

// Map game slugs to icons
const gameIcons: Record<string, React.ElementType> = {
  "cs-go": Crosshair,
  "csgo": Crosshair,
  "cs2": Crosshair,
  "dota-2": Swords,
  "dota2": Swords,
  "league-of-legends": Crown,
  "lol": Crown,
  "valorant": Target,
  "overwatch": Rocket,
  "overwatch-2": Rocket,
  "r6siege": Bomb,
  "rainbow-6-siege": Bomb,
  "pubg": Joystick,
  "starcraft-2": Wand2,
  "rocket-league": Rocket,
  "cod-mw": Crosshair,
  "call-of-duty": Crosshair,
};

function getGameIcon(slug: string) {
  return gameIcons[slug] || Gamepad2;
}

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
        <Gamepad2 size={13} />
        All
      </button>
      {games?.map((game) => {
        const Icon = getGameIcon(game.slug);
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
            <Icon size={13} />
            {game.name}
          </button>
        );
      })}
    </div>
  );
}
