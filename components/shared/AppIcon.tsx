"use client";

import {
  ArrowUpRight,
  ArrowRight,
  CaretLeft,
  CaretRight,
  Check,
  CheckCircle,
  Coins,
  Crop,
  DotsThree,
  DownloadSimple,
  Eraser,
  GlobeSimple,
  House,
  Images,
  MagicWand,
  Palette,
  ShieldCheck,
  Shapes,
  Sparkle,
  UploadSimple,
  X,
  type Icon,
  type IconProps,
  type IconWeight,
} from "@phosphor-icons/react";
import type { IconKey } from "@/constants";

/**
 * The one icon map for the whole site. `@/constants` stays data-only so server
 * components can import it, and nothing outside this file imports the Phosphor
 * package either — under React 19 the server bundle resolves `react` to
 * `react-server`, which omits `createContext`, so importing a Phosphor icon
 * from a server component throws at module scope. Routing every glyph through
 * this client component is what keeps server pages free of that package.
 */
const ICONS: Record<IconKey, Icon> = {
  house: House,
  coins: Coins,
  images: Images,
  sparkles: Sparkle,
  eraser: Eraser,
  palette: Palette,
  shapes: Shapes,
  crop: Crop,
  upload: UploadSimple,
  wand: MagicWand,
  download: DownloadSimple,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  check: Check,
  "check-circle": CheckCircle,
  x: X,
  "shield-check": ShieldCheck,
  "caret-left": CaretLeft,
  "caret-right": CaretRight,
  "dots-three": DotsThree,
  "globe-simple": GlobeSimple,
};

/**
 * Phosphor icons take `size`, `weight` and `color` rather than CSS sizing, so
 * those three are handled here and everything else passes through to the svg.
 */
export function AppIcon({
  name,
  size = 18,
  weight = "bold",
  className,
  ...rest
}: {
  name: IconKey;
  size?: number | string;
  weight?: IconWeight;
  className?: string;
} & Omit<IconProps, "size" | "weight" | "className">) {
  const Glyph = ICONS[name];
  return <Glyph size={size} weight={weight} className={className} {...rest} />;
}
