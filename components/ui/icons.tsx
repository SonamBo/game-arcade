/**
 * Icon set — duotone geometric marks drawn with react-native-svg. Two roles:
 *
 *   FamilyMark — the mark centred on a game's art plate (§5.5). One per Family.
 *   TabIcon    — the four tab-bar glyphs (§5.8).
 *
 * "Duotone" here means a faint fill layer under a solid stroke, both in the
 * same ink colour — no second hue, since colour is reserved for live/rival.
 * These stand in for Phosphor duotone; they read cleanly from 24px to 52px.
 */
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { C } from '@/theme/tokens';
import type { FamilyMarkName } from '@/theme/plates';

const FILL = 0.18; // duotone background layer opacity

export function FamilyMark({ name, size = 52, color = C.text }: { name: FamilyMarkName; size?: number; color?: string }) {
  const sw = Math.max(1.5, size * 0.055);
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {name === 'tap' && (
        <>
          <Circle cx={24} cy={24} r={18} fill={color} opacity={FILL} />
          <Circle cx={24} cy={24} r={12} stroke={color} strokeWidth={sw} />
          <Circle cx={24} cy={24} r={4} fill={color} />
        </>
      )}
      {name === 'swipe' && (
        <>
          <Path d="M6 30 L20 30 L20 40 Z" fill={color} opacity={FILL} />
          <Path d="M10 16 L22 24 L10 32" stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
          <Path d="M24 16 L36 24 L24 32" stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
        </>
      )}
      {name === 'timing' && (
        <>
          <Circle cx={24} cy={26} r={16} fill={color} opacity={FILL} />
          <Circle cx={24} cy={26} r={16} stroke={color} strokeWidth={sw} />
          <Line x1={24} y1={26} x2={24} y2={14} stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Line x1={24} y1={26} x2={32} y2={30} stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Line x1={19} y1={6} x2={29} y2={6} stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {name === 'numbers' && (
        <>
          <Rect x={8} y={8} width={14} height={14} rx={2} fill={color} opacity={FILL} />
          <Rect x={26} y={26} width={14} height={14} rx={2} fill={color} opacity={FILL} />
          <Rect x={26} y={8} width={14} height={14} rx={2} stroke={color} strokeWidth={sw} />
          <Rect x={8} y={26} width={14} height={14} rx={2} stroke={color} strokeWidth={sw} />
        </>
      )}
      {name === 'memory' && (
        <>
          <Rect x={8} y={12} width={20} height={26} rx={2} fill={color} opacity={FILL} />
          <Rect x={20} y={10} width={20} height={26} rx={2} stroke={color} strokeWidth={sw} />
        </>
      )}
    </Svg>
  );
}

export type TabIconName = 'home' | 'duels' | 'feed' | 'me';

export function TabIcon({ name, size = 24, color = C.n700 }: { name: TabIconName; size?: number; color?: string }) {
  const sw = 2;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'home' && (
        <>
          <Path d="M4 11 L12 4 L20 11 V20 H4 Z" fill={color} opacity={FILL} />
          <Path d="M4 11 L12 4 L20 11" stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
          <Path d="M6 11 V20 H18 V11" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
        </>
      )}
      {name === 'duels' && (
        <>
          <Path d="M5 4 L14 15 L12 17 L4 7 Z" fill={color} opacity={FILL} />
          <Path d="M5 4 L15 16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M19 4 L9 16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M7 20 L11 16 M17 20 L13 16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {name === 'feed' && (
        <>
          <Circle cx={12} cy={12} r={9} fill={color} opacity={FILL} />
          <Circle cx={8} cy={16} r={1.8} fill={color} />
          <Path d="M8 11 A5 5 0 0 1 13 16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M8 7 A9 9 0 0 1 17 16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {name === 'me' && (
        <>
          <Circle cx={12} cy={12} r={9} fill={color} opacity={FILL} />
          <Circle cx={12} cy={10} r={3.2} stroke={color} strokeWidth={sw} />
          <Path d="M6.5 18 A6 6 0 0 1 17.5 18" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}
