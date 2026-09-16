/**
 * Design tokens — Broadsheet, direction 2a "Arcade Gallery".
 * Values are literals resolved from the design system's OKLCH ramps.
 * Radius is small but non-zero. Type is Source Serif 4 throughout,
 * including UI chrome — there is no sans-serif in this product.
 */
export const C = {
  bg: '#f3f2f2',
  surface: '#eae9e9',
  text: '#201e1d',

  /* Cyan — anything actionable right now. */
  accent: '#0088b0',
  accentPressed: '#006786',
  accentTint: '#e9f8ff',
  /** Accent-coloured type on a tint, and accent text below 15px. */
  accentDeep: '#004961',

  /* Magenta — a rival who just passed you. Nothing else. */
  urgent: '#d6006c',
  urgentTint: '#fff1f4',
  urgentDeep: '#aa0b56',

  /** Used only where a scroll edge must be felt. Never to structure a page. */
  divider: 'rgba(32,30,29,0.16)',

  n100: '#f8f4f4',
  n200: '#eae7e7',
  n300: '#d7d3d3',
  n400: '#bab6b6',
  n500: '#9b9797',
  n600: '#7d7979',
  /**
   * n700 is the floor for secondary text — 5.83:1 on the paper ground.
   * Every meta line, sub-line and small label uses this. Never n600
   * (3.84:1) and never n500 (2.9:1) for text: grey-on-grey is the defect
   * this redesign exists to fix. n300-n600 are for plates, marks,
   * borders and disabled states only.
   */
  n700: '#605d5d',
  n800: '#444141',
  n900: '#2d2b2b',
} as const;

/**
 * Art plates. A game's plate colour is its family's, and it is always neutral.
 * The spec names four archetype plates (tower/timing/runner/precision); the
 * catalogue groups by five Families, so all five are mapped here to a neutral
 * shade — no colour ever lands on a plate. See theme/plates.ts for the
 * Family → plate/icon mapping.
 */
export const PLATE = {
  tower: '#d7d3d3',
  timing: '#eae7e7',
  runner: '#bab6b6',
  precision: '#eae9e9',
  numbers: '#e2dede',
  memory: '#f0ecec',
} as const;

/** Spacing — Broadsheet density 1.25x. Do not tighten. */
export const S = {
  /** Horizontal inset for every screen edge. */
  inset: 20,
  /** Gap between bands. Replaces the old section rule entirely. */
  band: 30,
  /** Gap between tiles in a rail. */
  rail: 15,
  /** Padding inside a card. */
  card: 20,
  row: 15,
} as const;

export const R = { sm: 1, md: 2, lg: 4, pill: 999 } as const;

/** Elevation — the only depth in the system. Cards md, plates sm. */
export const E = {
  sm: { shadowColor: '#2d2b2b', shadowOpacity: 0.14, shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  md: { shadowColor: '#2d2b2b', shadowOpacity: 0.16, shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  lg: { shadowColor: '#2d2b2b', shadowOpacity: 0.22, shadowRadius: 32,
        shadowOffset: { width: 0, height: 12 }, elevation: 8 },
} as const;

/** Type roles. Source Serif 4, weights 400 and 600 only. */
export const T = {
  /** Results banner. One per screen. */
  run:      { fontFamily: 'SourceSerif4_600SemiBold', fontSize: 68, lineHeight: 70 },
  /** Hero titles, wallet balance, onboarding headline. */
  display:  { fontFamily: 'SourceSerif4_600SemiBold', fontSize: 39, lineHeight: 41 },
  /** Screen titles and hero card titles. */
  title:    { fontFamily: 'SourceSerif4_600SemiBold', fontSize: 31, lineHeight: 34 },
  /** Band heads: "Your shelf", "Someone passed you". */
  band:     { fontFamily: 'SourceSerif4_600SemiBold', fontSize: 20, lineHeight: 26 },
  /** Score columns and stat figures. */
  figure:   { fontFamily: 'SourceSerif4_600SemiBold', fontSize: 26, lineHeight: 28 },
  /** Game names under a plate, row titles. */
  rowTitle: { fontFamily: 'SourceSerif4_600SemiBold', fontSize: 16, lineHeight: 21 },
  /** Body copy and explanatory lines. */
  body:     { fontFamily: 'SourceSerif4_400Regular', fontSize: 15, lineHeight: 24 },
  /** Sub-lines under a name. The floor for ordinary reading. */
  meta:     { fontFamily: 'SourceSerif4_400Regular', fontSize: 13, lineHeight: 18 },
  /** Kicker above a hero title, and tab bar labels. Only these two. */
  micro:    { fontFamily: 'SourceSerif4_400Regular', fontSize: 12, lineHeight: 16,
              letterSpacing: 1.2 },
} as const;

export const MIN_TAP = 48;
/** Raised from 10. Nothing outside T.micro may go below this. */
export const MIN_TEXT = 12;

export const CANVAS = { width: 412, height: 892 } as const;

/**
 * Cyan is for what you can act on. Magenta is for a rival who just
 * passed you. Both never appear in the same component.
 */
export const ACCENT_USES = [
  'primary-action', 'link', 'live-countdown', 'selected-tab',
] as const;
export const URGENT_USES = ['rival-passed-you'] as const;
