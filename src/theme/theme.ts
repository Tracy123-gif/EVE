export const colors = {
  paper: '#FAF3E6',
  paperDark: '#F0E5D2',
  rose: '#E7A2A0',
  sage: '#8FA377',
  mustard: '#E3A857',
  denim: '#6C8CA0',
  plum: '#4A3140',
  white: '#FFFFFF',
  black: '#000000',
} as const;

// Futura requires a paid embedding license for app bundling; Jost is the
// free, open-license substitute recommended in the design brief.
// Hangyaboly is personal-use-only; Caveat (Google Fonts, open license) is
// the free substitute for the handwritten/whimsical voice.
export const fonts = {
  important: 'Jost_400Regular',
  importantMedium: 'Jost_500Medium',
  importantSemiBold: 'Jost_600SemiBold',
  importantBold: 'Jost_700Bold',
  whimsical: 'Caveat_400Regular',
  whimsicalBold: 'Caveat_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const shadow = {
  soft: {
    shadowColor: colors.plum,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
} as const;

export const theme = { colors, fonts, spacing, radii, shadow };

export type Theme = typeof theme;
