/**
 * The five daily quests (build brief §7 / UI spec §10 "QUEST DONE"). Fixed set,
 * reset at local midnight, each worth coins on claim. Progress is counted from
 * the runs the player finishes that day.
 */
export type QuestMetric = 'runs' | 'distinct' | 'bestsBeaten' | 'ghostsTaken' | 'variantCleared';

export interface QuestDef {
  id: string;
  label: string;
  goal: number;
  coin: number;
  metric: QuestMetric;
}

export const DAILY_QUESTS: QuestDef[] = [
  { id: 'runs5', label: 'Finish five runs', goal: 5, coin: 25, metric: 'runs' },
  { id: 'distinct3', label: 'Play three different games', goal: 3, coin: 40, metric: 'distinct' },
  { id: 'best', label: 'Beat any personal best', goal: 1, coin: 30, metric: 'bestsBeaten' },
  { id: 'ghost', label: "Take a rival's ghost", goal: 1, coin: 45, metric: 'ghostsTaken' },
  { id: 'variant', label: "Clear today's variant", goal: 1, coin: 50, metric: 'variantCleared' },
];

export const QUEST_COUNT = DAILY_QUESTS.length;
