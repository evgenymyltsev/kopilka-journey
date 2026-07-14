import { CELL_SIZE } from './constants';
import type { SpriteRect } from './sprites';
import { TILE } from './constants';

export interface MilestoneDef {
  id: string;
  threshold: number;
  title: string;
  blurb: string;
  npcIndex: number;
  rewardKind: 'chest' | 'pot' | 'torch' | 'campfire';
}

/** Quest markers along the wasteland road */
export const MILESTONE_DEFS: MilestoneDef[] = [
  {
    id: 'm1500',
    threshold: 1500,
    title: 'Radio Signal',
    blurb: '1,500₽ logged. A Vault Dweller tips their helmet.',
    npcIndex: 0,
    rewardKind: 'pot',
  },
  {
    id: 'm5000',
    threshold: 5000,
    title: 'Caravan Cache',
    blurb: '5,000₽ secured. The caravan trader marks you as trusted.',
    npcIndex: 2,
    rewardKind: 'chest',
  },
  {
    id: 'm10000',
    threshold: 10000,
    title: 'Bunker Door',
    blurb: '10,000₽. A ghoul scout unseals a stash for you.',
    npcIndex: 3,
    rewardKind: 'chest',
  },
  {
    id: 'm25000',
    threshold: 25000,
    title: 'Highway Flare',
    blurb: '25,000₽ — city ruins on the horizon.',
    npcIndex: 0,
    rewardKind: 'torch',
  },
  {
    id: 'm50000',
    threshold: 50000,
    title: 'Mr. Handy Audit',
    blurb: '50,000₽. Your Pip-Boy ledger gets a gold star. Metaphorically.',
    npcIndex: 6,
    rewardKind: 'campfire',
  },
  {
    id: 'm100000',
    threshold: 100000,
    title: 'Legendary Stash',
    blurb: '100,000₽ — the wasteland’s best-kept chest creaks open.',
    npcIndex: 2,
    rewardKind: 'chest',
  },
  {
    id: 'm250000',
    threshold: 250000,
    title: 'Mutant Respect',
    blurb: '250,000₽. Even a Super Mutant nods. Slowly.',
    npcIndex: 4,
    rewardKind: 'chest',
  },
  {
    id: 'm500000',
    threshold: 500000,
    title: 'Almost Home',
    blurb: '500,000₽ — objective nearly complete, vaultie.',
    npcIndex: 7,
    rewardKind: 'torch',
  },
];

export interface MapMilestone {
  def: MilestoneDef;
  cellIndex: number;
}

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
