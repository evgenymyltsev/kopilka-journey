/** Wasteland NPCs — Pip-Boy dialogue flavor */
export const NPC_PROFILES: Record<
  number,
  { name: string; lines: string[] }
> = {
  0: {
    name: 'Vault Dweller',
    lines: [
      'War never changes. Your spending habits can.',
      'Another Nuka skipped is another step west.',
      'The Overseer would approve this thrift.',
    ],
  },
  2: {
    name: 'Caravan Trader',
    lines: [
      'Caps in the tin beat caps in the bar.',
      'I sell junk. You sell discipline. Fair trade.',
      'Resist Jet today — your future self sends thanks.',
    ],
  },
  3: {
    name: 'Ghoul Scout',
    lines: [
      'I’ve outlived brands. Skip the smoke. Stay irradiated… thrifty.',
      'Wasteland tip: don’t buy what won’t help you survive.',
      'Your map marker looks stronger already.',
    ],
  },
  4: {
    name: 'Super Mutant',
    lines: [
      'HUNGRY FOR CAPS? SAVE THEM. SMARTER THAN BRAHMIN.',
      'NO JET. STRONG MIND. STRONG VAULT.',
      'GOAL AHEAD. KEEP WALKING, HUMAN.',
    ],
  },
  5: {
    name: 'Nightkin',
    lines: [
      'Stealth boy for wallets: just don’t buy stuff.',
      'I saw your objective. It’s brighter than a flare.',
      'Shadow the urge. Pass the Nuka.',
    ],
  },
  6: {
    name: 'Mr. Handy',
    lines: [
      'Sir/madam, your ledger is delightfully green today.',
      'Shall I file this as “resisted temptation”? Excellent.',
      'Compound interest and compound willpower. Both recommended.',
    ],
  },
  7: {
    name: 'Brahmin Herder',
    lines: [
      'Slow and steady. Like a two-headed brahmin.',
      'Don’t light up — the trail’s long enough.',
      'Checkpoint ahead. Keep those caps stacked.',
    ],
  },
};

const FALLBACK = {
  name: 'Wastelander',
  lines: ['Nice pace, traveler. The wasteland rewards the thrifty.'],
};

export function getNpcProfile(npcIndex: number) {
  return NPC_PROFILES[npcIndex] ?? FALLBACK;
}

export function pickNpcLine(
  npcIndex: number,
  seed: number,
  cellIndex: number,
): string {
  const profile = getNpcProfile(npcIndex);
  const i =
    Math.abs((seed ^ (cellIndex * 2654435761)) >>> 0) % profile.lines.length;
  return profile.lines[i];
}

export interface NpcEncounter {
  key: string;
  name: string;
  line: string;
  cellIndex: number;
}
