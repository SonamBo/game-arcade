/**
 * Rail (§5.5) — a horizontal ScrollView of tiles: S.rail gaps, S.inset content
 * padding, no scroll indicator. The inset plus tile widths leave a partial
 * fourth tile visible so the edge reads as scrollable.
 */
import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { S } from '@/theme/tokens';

export function Rail({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: S.inset, gap: S.rail }}
    >
      {children}
    </ScrollView>
  );
}
