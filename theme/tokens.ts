/**
 * Design tokens — transcribed exactly from the UI build spec §3 and the
 * build brief §4. This file is the only place a colour, a spacing value or a
 * type role is allowed to be defined.
 *
 * Two rules the prototype breaks and this app must not:
 *   - every interactive row and tab is at least MIN_TAP tall
 *   - no readable text is below MIN_TEXT
 * Grow padding, never shrink type.
 *
 * Radius is zero everywhere. There is no rounded corner in this product.
 */

/** Colour. Never write a raw hex in a component. */
export const C = {
  bg: '#f3f2f2',
  surface: '#eae9e9',
  text: '#201e1d',

  accent: '#ec3013',
  accentPressed: '#dd2b0f',
  /** Row background meaning "a rival is involved" or "this is urgent". */
  accentTint: '#fff2ef',
  /** Accent-coloured type at 11px and below — flat accent is not readable there. */
  accentDeep: '#ae1800',

  divider: 'rgba(32,30,29,0.4)',

  n200: '#eae7e7',
  n300: '#d7d3d3',
  n400: '#bab6b6',
  n500: '#9b9797',
  n600: '#7d7979',
  n700: '#605d5d',
  n800: '#444141',
  n900: '#2d2b2b',
} as const;

/** Spacing and rule weights. */
export const S = {
  /** Horizontal inset for every text edge on every screen. */
  inset: 14,
  /** Vertical padding inside a list row. */
  row: 12,
  /** Grid seam: tile grids are a divider-coloured container with 2px gaps. */
  gap: 2,
  /** Section rule — between major sections and above the tab bar. */
  rule: 2,
  /** Row rule — between list rows of the same kind. */
  hairline: 1,
} as const;

/** Type roles. Archivo throughout: 800 structural, 400/600 prose. */
export const T = {
  /** Results banner only. One per screen. */
  run: { fontFamily: 'Archivo_800ExtraBold', fontSize: 72, letterSpacing: -2.9 },
  /** Poster drop, onboarding headline, wallet balance. */
  display: { fontFamily: 'Archivo_800ExtraBold', fontSize: 42, letterSpacing: -1.5 },
  /** Duels, Inbox, profile handle, bracket round. */
  title: { fontFamily: 'Archivo_800ExtraBold', fontSize: 26, letterSpacing: -0.8 },
  /** Score columns, stat tiles, feed post figures. */
  figure: { fontFamily: 'Archivo_800ExtraBold', fontSize: 25 },
  /** Game names, friend names, duel rows. */
  rowTitle: { fontFamily: 'Archivo_800ExtraBold', fontSize: 17 },
  /** Explanatory lines, notification text. */
  body: { fontFamily: 'Archivo_400Regular', fontSize: 13, lineHeight: 20 },
  /** Sub-lines: "Best 47 · 26 runs". */
  meta: { fontFamily: 'Archivo_400Regular', fontSize: 11 },
  /** Section labels, banner kickers, column heads. Uppercase only. */
  kicker: { fontFamily: 'Archivo_600SemiBold', fontSize: 10, letterSpacing: 1.2 },
} as const;

/** Production corrections. These win over the reference prototype. */
export const MIN_TAP = 48;
export const MIN_TEXT = 10;

/** Design canvas the spec is drawn against — Android, 1x dp. */
export const CANVAS = { width: 412, height: 892 } as const;

/**
 * The accent is reserved for exactly four things:
 *   1. the daily drop poster
 *   2. a personal-best banner
 *   3. the live rivalry number
 *   4. the primary action on screen
 * Nothing else. If a fifth use appears, the screen is wrong.
 */
export const ACCENT_USES = [
  'drop-poster',
  'personal-best',
  'rivalry-number',
  'primary-action',
] as const;

export type AccentUse = (typeof ACCENT_USES)[number];
