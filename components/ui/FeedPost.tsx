/**
 * Feed post (§6, §07). A full-width row, not a card: handle at 13px/800 (taps
 * the profile), an accent kicker naming the event, timestamp right; a 19px
 * headline and meta line on the left, the post's number at 27px with its unit
 * on the right. Footer: reaction count, comment count, and an outlined verb CTA
 * that always launches a run. Posts that involve the reader sit on accent tint;
 * an optional top comment hangs below on a 2px neutral left rule.
 *
 * States: involves you (tinted) · neutral · global moment.
 */
import { Pressable, Text, View } from 'react-native';

import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';
import { Button } from './primitives';

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
  onVerb?: () => void;
  onProfile?: () => void;
}) {
  return (
    <View
      style={{
        paddingHorizontal: S.inset,
        paddingVertical: 14,
        backgroundColor: involvesYou ? C.accentTint : C.bg,
      }}
    >
      {/* handle · kicker · time */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <Pressable onPress={onProfile} hitSlop={8}>
            <Text style={text('rowTitle', { color: C.text })}>{who}</Text>
          </Pressable>
          <Text style={text('kicker', { color: global ? C.n500 : C.accentDeep })}>{kicker}</Text>
        </View>
        <Text style={text('meta', { color: C.n500, numeric: true })}>{time}</Text>
      </View>

      {/* headline + figure */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6, gap: 12 }}>
        <Text style={[{ fontFamily: T.rowTitle.fontFamily, fontSize: 19, color: C.text, flex: 1 }]}>
          {headline}
        </Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: T.figure.fontFamily, fontSize: 27, color: C.text, fontVariant: ['tabular-nums'] }}>
            {figure.toLocaleString()}
          </Text>
          <Text style={text('meta', { color: C.n600 })}>{unit}</Text>
        </View>
      </View>

      {/* footer: reactions · comments · verb */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Text style={text('meta', { color: C.n600, numeric: true })}>▲ {reactions}</Text>
          <Text style={text('meta', { color: C.n600, numeric: true })}>💬 {comments}</Text>
        </View>
        <Button label={verb} variant="outlined" onPress={onVerb} />
      </View>

      {/* optional top comment on a 2px neutral left rule */}
      {comment ? (
        <View style={{ borderLeftWidth: S.rule, borderLeftColor: C.n400, paddingLeft: 10, marginTop: 12 }}>
          <Text style={text('body', { color: C.n700 })}>{comment}</Text>
        </View>
      ) : null}
    </View>
  );
}
