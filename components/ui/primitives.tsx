/**
 * Shared primitives every component and screen builds from. Kept deliberately
 * small: a button with the three variants the spec actually uses, the accent
 * square and dot from the top bar, and the two rule weights.
 *
 * One verb on every button (spec §8). Radius is zero. Buttons clear 48px.
 */
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export type ButtonVariant = 'accent' | 'inverse' | 'outlined';

/**
 * accent   — filled accent, the primary action on a screen
 * inverse  — background-on-accent, used inside an accent field (poster)
 * outlined — ink border on ground, a secondary action
 */
export function Button({
  label,
  onPress,
  variant = 'accent',
  full,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  full?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => {
        const base: ViewStyle = {
          minHeight: MIN_TAP,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 18,
          alignSelf: full ? 'stretch' : 'flex-start',
        };
        if (variant === 'accent') {
          return [base, { backgroundColor: pressed ? C.accentPressed : C.accent }];
        }
        if (variant === 'inverse') {
          return [base, { backgroundColor: pressed ? C.n200 : C.bg }];
        }
        return [
          base,
          {
            borderWidth: S.hairline,
            borderColor: C.text,
            backgroundColor: pressed ? C.surface : 'transparent',
          },
        ];
      }}
    >
      <Text
        style={text('kicker', {
          color: variant === 'accent' ? C.bg : variant === 'inverse' ? C.accent : C.text,
        })}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** The 9px accent square beside the coin balance (top bar), or a smaller dot. */
export function AccentSquare({ size = 9 }: { size?: number }) {
  return <View style={{ width: size, height: size, backgroundColor: C.accent }} />;
}

/** An unread / waiting dot. 7px on inbox, 6px on the DUELS tab. */
export function AccentDot({ size = 7 }: { size?: number }) {
  return <View style={{ width: size, height: size, backgroundColor: C.accent }} />;
}

/** Section rule (2px) or row rule (1px), horizontal. */
export function Rule({ weight = 'row' }: { weight?: 'row' | 'section' }) {
  return (
    <View
      style={{
        height: weight === 'section' ? S.rule : S.hairline,
        backgroundColor: C.divider,
      }}
    />
  );
}

/** A vertical 1px separator, e.g. between top-bar cells. */
export function VRule({ height = 18 }: { height?: number }) {
  return <View style={{ width: S.hairline, height, backgroundColor: C.divider }} />;
}

/** A labelled section band with a kicker, used to head a group of rows. */
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: S.inset,
        paddingTop: 22,
        paddingBottom: 8,
      }}
    >
      <Text style={text('kicker', { color: C.n600 })}>{kicker}</Text>
      {right ?? children}
    </View>
  );
}
