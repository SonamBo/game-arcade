/**
 * A game's art plate (§5.5). A neutral, family-coloured square with the
 * newsprint dot-screen over it and the family mark centred. When real key art
 * exists it fills the plate and the mark is dropped (art prop, future). The one
 * place the dot-screen texture lives, reused by tiles, list rows, the hero card
 * and the detail header.
 */
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { FamilyMark } from './icons';
import { markFor, plateFor } from '@/theme/plates';
import { C, E, R } from '@/theme/tokens';
import type { Family } from '@/types/models';

let uid = 0;

/** The newsprint dot screen — low-opacity ink dots on a 3px grid. */
export function DotScreen({ radius = 0.9, opacity = 0.18 }: { radius?: number; opacity?: number }) {
  const id = `dot${uid++}`;
  return (
    <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} width="100%" height="100%">
      <Defs>
        <Pattern id={id} width={3} height={3} patternUnits="userSpaceOnUse">
          <Circle cx={1.5} cy={1.5} r={radius} fill={C.n900} opacity={opacity} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

export function Plate({
  family,
  size = 116,
  radius = R.lg,
  markSize,
  elevation = E.sm,
  style,
}: {
  family: Family;
  size?: number;
  radius?: number;
  markSize?: number;
  elevation?: ViewStyle;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: radius, backgroundColor: plateFor(family), alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
        elevation,
        style,
      ]}
    >
      <DotScreen />
      <FamilyMark name={markFor(family)} size={markSize ?? size * 0.45} color={C.text} />
    </View>
  );
}
