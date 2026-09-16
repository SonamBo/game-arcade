/**
 * Shared primitives (§5.1, §5.2). Direction 2a: cyan for actionable, sentence
 * case, small radius, no rules. Button keeps its old variant names as aliases
 * so callers don't change — accent→primary, outlined→secondary, inverse→primary.
 */
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import { C, E, MIN_TAP, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'inverse' | 'outlined';

/**
 * primary   — cyan fill, ink-on-paper label. The one action on a screen.
 * secondary — 1px divider border, no fill.
 * ghost     — cyan label only, no chrome.
 * (accent = primary, outlined = secondary, inverse = primary — legacy aliases.)
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  full,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  full?: boolean;
}) {
  const v: 'primary' | 'secondary' | 'ghost' =
    variant === 'secondary' || variant === 'outlined'
      ? 'secondary'
      : variant === 'ghost'
        ? 'ghost'
        : 'primary';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => {
        const base: ViewStyle = {
          minHeight: MIN_TAP,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: v === 'ghost' ? 4 : 22,
          borderRadius: R.md,
          alignSelf: full ? 'stretch' : 'flex-start',
        };
        if (v === 'primary') return [base, { backgroundColor: pressed ? C.accentPressed : C.accent }];
        if (v === 'secondary') return [base, { borderWidth: 1, borderColor: C.divider, backgroundColor: pressed ? C.n200 : 'transparent' }];
        return [base, { opacity: pressed ? 0.6 : 1 }];
      }}
    >
      <Text style={text('rowTitle', { color: v === 'primary' ? C.bg : v === 'ghost' ? C.accent : C.text })}>
        {label}
      </Text>
    </Pressable>
  );
}

/** The round play button — 58px, the only circle in the product, hero only. */
export function RoundPlay({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Play"
      style={({ pressed }) => [
        { width: 58, height: 58, borderRadius: R.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? C.accentPressed : C.accent },
        E.md,
      ]}
    >
      <Text style={{ color: C.bg, fontSize: 22, marginLeft: 3 }}>▶</Text>
    </Pressable>
  );
}

export type TagKind = 'live' | 'rival' | 'neutral';

/** §5.2 — three tags, one each. Live = cyan, rival = magenta, neutral = outline. */
export function Tag({ kind, label }: { kind: TagKind; label: string }) {
  const style =
    kind === 'live'
      ? { bg: C.accentTint, fg: C.accentDeep, dot: C.accent }
      : kind === 'rival'
        ? { bg: C.urgentTint, fg: C.urgentDeep, dot: null }
        : { bg: 'transparent', fg: C.n800, dot: null };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: style.bg,
        borderWidth: kind === 'neutral' ? 1 : 0,
        borderColor: C.divider,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: R.md,
      }}
    >
      {style.dot ? <View style={{ width: 6, height: 6, borderRadius: R.pill, backgroundColor: style.dot }} /> : null}
      <Text style={[text('micro', { color: style.fg }), { letterSpacing: 0 }]}>{label}</Text>
    </View>
  );
}

/** A small status dot — cyan (live/unread) or magenta (needs an answer). */
export function Dot({ color = C.accent, size = 7 }: { color?: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: R.pill, backgroundColor: color }} />;
}

/**
 * A band head — a sentence-case title in T.band with S.band of space above.
 * `kicker` is the title string (name kept for caller compatibility).
 */
export function BandHeader({
  kicker,
  right,
  children,
}: {
  kicker: string;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: S.inset,
        paddingTop: S.band,
        paddingBottom: S.rail,
      }}
    >
      <Text style={text('band')}>{kicker}</Text>
      {right ?? children}
    </View>
  );
}
