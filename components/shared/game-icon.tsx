import type { JSX } from "react";
import {
  Crown,
  Gamepad2,
  Rocket,
  Swords,
  type LucideIcon,
} from "lucide-react";
import {
  siActivision,
  siBattledotnet,
  siCounterstrike,
  siDota2,
  siEpicgames,
  siFifa,
  siLeagueoflegends,
  siPubg,
  siUbisoft,
  siValorant,
} from "simple-icons";

interface GameIconProps {
  slug: string;
  size?: number;
  className?: string;
}

type IconRenderer = (props: { size?: number; className?: string }) => JSX.Element;

function BrandIcon({
  icon,
  size = 16,
  className,
}: {
  icon: { path: string };
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function createBrandIcon(icon: { path: string }): IconRenderer {
  return function Icon(props) {
    return <BrandIcon icon={icon} {...props} />;
  };
}

function createLucideIcon(Icon: LucideIcon): IconRenderer {
  return function LucideGameIcon({ size = 16, className }) {
    return <Icon aria-hidden="true" size={size} className={className} />;
  };
}

const LeagueOfLegendsIcon = createBrandIcon(siLeagueoflegends);
const CounterStrikeIcon = createBrandIcon(siCounterstrike);
const Dota2Icon = createBrandIcon(siDota2);
const ValorantIcon = createBrandIcon(siValorant);
const PubgIcon = createBrandIcon(siPubg);
const FifaIcon = createBrandIcon(siFifa);
const OverwatchIcon = createBrandIcon(siBattledotnet);
const RainbowSixIcon = createBrandIcon(siUbisoft);
const RocketLeagueIcon = createBrandIcon(siEpicgames);
const CallOfDutyIcon = createBrandIcon(siActivision);
const KingOfGloryIcon = createLucideIcon(Crown);
const MobileLegendsIcon = createLucideIcon(Swords);
const GenericGameIcon = createLucideIcon(Gamepad2);
const StarcraftIcon = createLucideIcon(Rocket);

const GAME_ICON_MAP: Record<string, IconRenderer> = {
  "league-of-legends": LeagueOfLegendsIcon,
  lol: LeagueOfLegendsIcon,
  "cs-go": CounterStrikeIcon,
  csgo: CounterStrikeIcon,
  cs2: CounterStrikeIcon,
  "counter-strike-2": CounterStrikeIcon,
  "dota-2": Dota2Icon,
  dota2: Dota2Icon,
  valorant: ValorantIcon,
  overwatch: OverwatchIcon,
  "overwatch-2": OverwatchIcon,
  ow: OverwatchIcon,
  pubg: PubgIcon,
  fifa: FifaIcon,
  "ea-sports-fc": FifaIcon,
  fc: FifaIcon,
  "cod-mw": CallOfDutyIcon,
  codmw: CallOfDutyIcon,
  "call-of-duty": CallOfDutyIcon,
  cod: CallOfDutyIcon,
  "rocket-league": RocketLeagueIcon,
  rl: RocketLeagueIcon,
  "r6-siege": RainbowSixIcon,
  r6siege: RainbowSixIcon,
  "rainbow-6-siege": RainbowSixIcon,
  "rainbow-six-siege": RainbowSixIcon,
  "starcraft-2": StarcraftIcon,
  sc2: StarcraftIcon,
  "king-of-glory": KingOfGloryIcon,
  kog: KingOfGloryIcon,
  "honor-of-kings": KingOfGloryIcon,
  "mobile-legends": MobileLegendsIcon,
  mlbb: MobileLegendsIcon,
  generic: GenericGameIcon,
};

export function GameIcon({ slug, size = 16, className }: GameIconProps) {
  const normalizedSlug = slug.toLowerCase();
  const Icon = GAME_ICON_MAP[normalizedSlug] || GenericGameIcon;

  return <Icon size={size} className={className} />;
}
