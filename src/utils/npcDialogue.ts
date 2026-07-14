/** Character sheet indices → display name + banter lines */
export const NPC_PROFILES: Record<
  number,
  { name: string; lines: string[] }
> = {
  0: {
    name: 'Wanderer',
    lines: [
      'Skip one coffee today. Future you will thank you.',
      'The path looks long, but every cell counts.',
      'I quit energy drinks last month. Still twitching. Worth it.',
    ],
  },
  2: {
    name: 'Villager',
    lines: [
      'My piggy bank is jealous of yours. Keep going!',
      'Smoke less, dream more. That’s the village motto.',
      'There’s a chest ahead… or maybe just a rock. Stay curious.',
    ],
  },
  3: {
    name: 'Skeleton Guard',
    lines: [
      'I saved for decades. Literally. Bones and all.',
      'Buy nothing today. That’s an order from beyond.',
      'Death is free. Cigarettes aren’t. Choose wisely.',
    ],
  },
  4: {
    name: 'Slime Buddy',
    lines: [
      'Blorp! Saving is sticky business. You’re doing great!',
      'I invested in goo. You invest in goals. Same vibe.',
      'Don’t slide backward… unless it’s a bargain. Wait, no bargains!',
    ],
  },
  5: {
    name: 'Night Bat',
    lines: [
      'I only shop at midnight sales. Bad habit. Don’t copy me.',
      'Flap past temptation. Your goal is louder than ads.',
      'Coffee after dark? Bold. Skipping it? Bolder.',
    ],
  },
  6: {
    name: 'Ghost Banker',
    lines: [
      'Interest compounds. So does regret. Prefer the first.',
      'Your balance sheet looks… almost haunted by progress.',
      'Withdraw from bad habits. Deposit into the dream.',
    ],
  },
  7: {
    name: 'Beetle Merchant',
    lines: [
      'I sell pebbles. You sell discipline. You’re richer already.',
      'Click your heels — and skip that purchase.',
      'Trade you a tip: the finish line loves thrifty travelers.',
    ],
  },
};

const FALLBACK = {
  name: 'Traveler',
  lines: ['Nice pace. The map remembers every smart choice.'],
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
  const i = Math.abs((seed ^ (cellIndex * 2654435761)) >>> 0) % profile.lines.length;
  return profile.lines[i];
}

export interface NpcEncounter {
  key: string;
  name: string;
  line: string;
  cellIndex: number;
}
