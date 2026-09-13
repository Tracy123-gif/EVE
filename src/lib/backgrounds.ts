import { colors } from '../theme/theme';

export type BackgroundDef = {
  key: string;
  label: string;
  colors: [string, string];
  animated: boolean;
};

export const STATIC_BACKGROUNDS: BackgroundDef[] = [
  { key: 'paper', label: 'Paper', colors: [colors.paper, colors.paperDark], animated: false },
  { key: 'rose-mustard', label: 'Warm', colors: [colors.rose, colors.mustard], animated: false },
  { key: 'sage-denim', label: 'Fresh', colors: [colors.sage, colors.denim], animated: false },
  { key: 'denim-plum', label: 'Dusk', colors: [colors.denim, colors.plum], animated: false },
  { key: 'mustard-rose', label: 'Sunset', colors: [colors.mustard, colors.rose], animated: false },
  { key: 'plum-denim', label: 'Night', colors: [colors.plum, colors.denim], animated: false },
];

export const ANIMATED_BACKGROUNDS: BackgroundDef[] = [
  { key: 'anim-sunrise', label: 'Sunrise Drift', colors: [colors.mustard, colors.rose], animated: true },
  { key: 'anim-tide', label: 'Tide', colors: [colors.denim, colors.sage], animated: true },
  { key: 'anim-dusk', label: 'Dusk Glow', colors: [colors.plum, colors.rose], animated: true },
];

export const ALL_BACKGROUNDS = [...STATIC_BACKGROUNDS, ...ANIMATED_BACKGROUNDS];

export function getBackground(key: string | null): BackgroundDef {
  return ALL_BACKGROUNDS.find((b) => b.key === key) ?? STATIC_BACKGROUNDS[0];
}
