import { CELL_SIZE } from './constants';
import type { SpriteRect } from './sprites';
import { TILE } from './constants';

export interface MilestoneDef {
  id: string;
  threshold: number;
  title: string;
  blurb: string;
  /** индекс персонажа на characters sheet (0..7, кроме 1 = игрок) */
  npcIndex: number;
  rewardKind: 'chest' | 'pot' | 'torch' | 'campfire';
}

/** Фиксированные вехи геймификации */
export const MILESTONE_DEFS: MilestoneDef[] = [
  {
    id: 'm1500',
    threshold: 1500,
    title: 'First checkpoint',
    blurb: 'You saved 1,500₽ — a traveler waves at you!',
    npcIndex: 0,
    rewardKind: 'pot',
  },
  {
    id: 'm5000',
    threshold: 5000,
    title: 'Warming up',
    blurb: '5,000₽ in the piggy bank. The village trader is pleased.',
    npcIndex: 2,
    rewardKind: 'chest',
  },
  {
    id: 'm10000',
    threshold: 10000,
    title: 'Ten grand',
    blurb: '10,000₽! The chest guard nods.',
    npcIndex: 3,
    rewardKind: 'chest',
  },
  {
    id: 'm25000',
    threshold: 25000,
    title: 'Quarter way',
    blurb: '25,000₽ — the city is already in sight.',
    npcIndex: 0,
    rewardKind: 'torch',
  },
  {
    id: 'm50000',
    threshold: 50000,
    title: 'Fifty K',
    blurb: '50,000₽. The ghost banker applauds.',
    npcIndex: 6,
    rewardKind: 'campfire',
  },
  {
    id: 'm100000',
    threshold: 100000,
    title: 'Hundred K',
    blurb: '100,000₽ — the legendary chest is open.',
    npcIndex: 2,
    rewardKind: 'chest',
  },
  {
    id: 'm250000',
    threshold: 250000,
    title: 'Champion',
    blurb: '250,000₽. The slime treasurer is stunned.',
    npcIndex: 4,
    rewardKind: 'chest',
  },
  {
    id: 'm500000',
    threshold: 500000,
    title: 'Half a million',
    blurb: '500,000₽ — almost at the finish line.',
    npcIndex: 7,
    rewardKind: 'torch',
  },
];

export interface MapMilestone {
  def: MilestoneDef;
  cellIndex: number;
}

/** Вехи, которые помещаются до цели (строго меньше goal, финиш — отдельно) */
export function milestonesForGoal(goalAmount: number): MilestoneDef[] {
  return MILESTONE_DEFS.filter((m) => m.threshold < goalAmount);
}

export function placeMilestones(
  goalAmount: number,
  totalCells: number,
): MapMilestone[] {
  return milestonesForGoal(goalAmount).map((def) => ({
    def,
    cellIndex: Math.min(
      totalCells - 1,
      Math.max(1, Math.floor(def.threshold / CELL_SIZE)),
    ),
  }));
}

export function newlyReachedMilestones(
  prevSaved: number,
  nextSaved: number,
  goalAmount: number,
  alreadyClaimed: string[],
): MilestoneDef[] {
  const claimed = new Set(alreadyClaimed);
  return milestonesForGoal(goalAmount).filter(
    (m) =>
      !claimed.has(m.id) && prevSaved < m.threshold && nextSaved >= m.threshold,
  );
}

/** characters.png: 4×2 блока по 48×64, кадр 16×16, idle = центр, down */
export function npcIdleFrame(npcIndex: number): SpriteRect {
  const idx = ((npcIndex % 8) + 8) % 8;
  const cx = idx % 4;
  const cy = Math.floor(idx / 4);
  return {
    sheet: 'characters',
    x: cx * 48 + TILE,
    y: cy * 64,
    w: TILE,
    h: TILE,
  };
}

export function rewardSpriteKind(
  kind: MilestoneDef['rewardKind'],
  claimed: boolean,
): 'chestOpen' | 'chestClosed' | 'pot' | 'torch' | 'campfire' {
  if (kind === 'chest') return claimed ? 'chestOpen' : 'chestClosed';
  return kind === 'pot' ? 'pot' : kind === 'torch' ? 'torch' : 'campfire';
}
