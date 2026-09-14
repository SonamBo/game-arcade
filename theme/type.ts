/**
 * Typed helpers over the tokens. Components import from here rather than
 * hand-assembling text styles, so the two production corrections and the
 * tabular-numerals rule are impossible to forget.
 */
import type { TextStyle, ViewStyle } from 'react-native';
import { C, MIN_TAP, MIN_TEXT, S, T } from './tokens';

export type TypeRole = keyof typeof T;

/** The Archivo faces loaded at the root layout. */
export const FONT_FAMILIES = [
  'Archivo_400Regular',
  'Archivo_600SemiBold',
  'Archivo_800ExtraBold',
] as const;

/**
 * A text style for a role.
 *
 * Scores sit in columns and must not jitter as they tick, so anything that can
 * hold a number gets tabular figures. Pass `numeric` explicitly for body or
 * meta text that shows a figure.
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
    ...(opts.uppercase || role === 'kicker'
      ? { textTransform: 'uppercase' as const }
      : null),
  };
}

/**
 * A kicker's colour depends on where it sits: accent type at 11px and below is
 * not readable flat, so it uses accent-deep.
 */
export function kicker(tone: 'neutral' | 'accent' = 'neutral'): TextStyle {
  return text('kicker', { color: tone === 'accent' ? C.accentDeep : C.n600 });
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

/** Row rule between list items of the same kind. */
export const rowRule: ViewStyle = {
  borderBottomWidth: S.hairline,
  borderBottomColor: C.divider,
};

/** Section rule between major sections and above the tab bar. */
export const sectionRule: ViewStyle = {
  borderBottomWidth: S.rule,
  borderBottomColor: C.divider,
};

/** Full-bleed screen ground. Never a gradient, never a second background. */
export const screen: ViewStyle = {
  flex: 1,
  backgroundColor: C.bg,
};
