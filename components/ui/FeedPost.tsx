/**
 * Feed post (§08). No rules — 30px of space separates posts. An avatar, one
 * sentence naming who did what (the figure folds into it), the game's 56px plate
 * at the right, and a single cyan "Beat it" link. Props unchanged; family for
 * the plate is derived from targetGame.
 */
import { Pressable, Text, View } from 'react-native';

import { Plate } from './Plate';
import { Button } from './primitives';
import { metaFor } from '@/data/catalogue';
import { C, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function FeedPost({
  who,
  kicker,
  time,
  headline,
  figure,
  unit,
  reactions,
  comments,
  verb,
  involvesYou,
  global,
  comment,
  targetGame,
  onVerb,
  onProfile,
}: {
  who: string;
  kicker: string;
  time: string;
  headline: string;
  figure: number;
  unit: string;
  reactions: number;
  comments: number;
  verb: string;
  involvesYou?: boolean;
  global?: boolean;
  comment?: string;
  targetGame: string;
  onVerb?: () => void;
  onProfile?: () => void;
}) {
  const family = metaFor(targetGame)?.family ?? 'TAP';
  return (
    <View style={{ paddingHorizontal: S.inset, paddingVertical: S.rail }}>
      <View style={{ flexDirection: 'row', gap: S.rail, alignItems: 'flex-start' }}>
        <Pressable onPress={onProfile} hitSlop={6}>
          <View style={{ width: 36, height: 36, borderRadius: R.pill, backgroundColor: C.n300, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={text('meta', { color: C.n800 })}>{who[0]}</Text>
          </View>
        </Pressable>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={text('body')}>
            <Text style={{ fontFamily: 'SourceSerif4_600SemiBold' }} onPress={onProfile}>{who}</Text>
            {`  ${headline}`}
          </Text>
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>
            {kicker.toLowerCase()} · {time}
          </Text>
          {comment ? (
            <Text style={[text('meta', { color: C.n700 }), { marginTop: 8, fontStyle: 'italic' }]}>“{comment}”</Text>
          ) : null}
          <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <Button label={verb} variant="ghost" onPress={onVerb} />
          </View>
        </View>

        <Plate family={family} size={56} radius={R.md} markSize={28} />
      </View>
    </View>
  );
}
