/**
 * Typed helpers over the tokens. Components import from here rather than
 * hand-assembling text styles, so the tap floor and the tabular-numerals rule
 * are impossible to forget.
 *
 * Direction 2a: Source Serif 4 throughout, sentence case everywhere. Uppercase
 * is opt-in and used by exactly two callers — the hero kicker and the tab bar.
 */
import type { TextStyle, ViewStyle } from 'react-native';
import { C, MIN_TEXT, MIN_TAP, S, T } from './tokens';

export type TypeRole = keyof typeof T;

/** The Source Serif 4 faces loaded at the root layout. */
export const FONT_FAMILIES = [
  'SourceSerif4_400Regular',
  'SourceSerif4_600SemiBold',
  'SourceSerif4_400Regular_Italic',
] as const;

/**
 * A text style for a role.
 *
 * Scores sit in columns and must not jitter as they tick, so anything that can
 * hold a number gets tabular figures. Pass `numeric` explicitly for body or
 * meta text that shows a figure. `uppercase` is opt-in and never automatic.
 */
export function text(
  role: TypeRole,
  opts: { color?: string; numeric?: boolean; uppercase?: boolean } = {}
): TextStyle {
  const base = T[role];
  const numeric =
    opts.numeric ?? (role === 'run' || role === 'display' || role === 'figure');

  if (base.fontSize < MIN_TEXT) {
    // Unreachable with the current tokens; guards against a later edit.
    throw new Error(`Type role "${role}" is below the ${MIN_TEXT}px floor.`);
  }

  return {
    ...base,
    color: opts.color ?? C.text,
    ...(numeric ? { fontVariant: ['tabular-nums' as const] } : null),
    ...(opts.uppercase ? { textTransform: 'uppercase' as const } : null),
  };
}

/**
 * The 12px micro label — the hero kicker and tab labels. Sentence case unless
 * the caller opts into uppercase. Neutral tone uses the n700 text floor; accent
 * tone is for a live/actionable label.
 */
export function kicker(tone: 'neutral' | 'accent' = 'neutral'): TextStyle {
  return text('micro', { color: tone === 'accent' ? C.accentDeep : C.n700 });
}

/**
 * Every interactive row and tab is at least 48px tall. Grow the padding,
 * never shrink the type.
 */
export function tappableRow(extra: ViewStyle = {}): ViewStyle {
  return {
    minHeight: MIN_TAP,
    justifyContent: 'center',
    paddingHorizontal: S.inset,
    paddingVertical: S.row,
    ...extra,
  };
}

/**
 * A band head's container style. Sections are separated by empty space, not
 * rules: S.band above, S.rail below, inset on the sides.
 */
export function band(): ViewStyle {
  return { paddingHorizontal: S.inset, paddingTop: S.band, paddingBottom: S.rail };
}

/** Full-bleed screen ground. Never a gradient, never a second background. */
export const screen: ViewStyle = {
  flex: 1,
  backgroundColor: C.bg,
};
