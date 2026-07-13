import { CELL_PX } from './constants';
import { SPRITES, type SpriteRect } from './sprites';

export type TerrainStage = 'forest' | 'village' | 'city' | 'finish';

export interface Point {
  x: number;
  y: number;
}

/** Mulberry32 — быстрый seeded RNG */
export function createRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(...parts: Array<string | number | null | undefined>): number {
  const s = parts.map((p) => String(p ?? '')).join('|');
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getTerrainStage(index: number, totalCells: number): TerrainStage {
  const pos = totalCells <= 1 ? 1 : index / (totalCells - 1);
  if (pos < 0.3) return 'forest';
  if (pos < 0.6) return 'village';
  if (pos < 0.9) return 'city';
  return 'finish';
}

export interface CellSprites {
  ground: SpriteRect;
  prop: SpriteRect | null;
}

export function getCellSprites(
  index: number,
  totalCells: number,
  rng?: () => number,
): CellSprites {
  const stage = getTerrainStage(index, totalCells);
  const roll = rng ? rng() : index % 2 === 0 ? 0.2 : 0.7;

  switch (stage) {
    case 'forest':
      return {
        ground: roll < 0.5 ? SPRITES.grass : SPRITES.grassAlt,
        prop:
          roll < 0.35
            ? SPRITES.tree
            : roll < 0.55
              ? SPRITES.treeAlt
              : roll < 0.75
                ? SPRITES.bush
                : roll < 0.88
                  ? SPRITES.rock
                  : null,
      };
    case 'village':
      return {
        ground: roll < 0.5 ? SPRITES.dirt : SPRITES.wood,
        prop:
          roll < 0.3
            ? SPRITES.pot
            : roll < 0.5
              ? SPRITES.potAlt
              : roll < 0.7
                ? SPRITES.door
                : roll < 0.85
                  ? SPRITES.sign
                  : null,
      };
    case 'city':
      return {
        ground: roll < 0.45 ? SPRITES.stone : roll < 0.8 ? SPRITES.brick : SPRITES.wall,
        prop:
          roll < 0.35
            ? SPRITES.pillar
            : roll < 0.55
              ? SPRITES.wall
              : roll < 0.7
                ? SPRITES.torch
                : roll < 0.82
                  ? SPRITES.fireplace
                  : null,
      };
    case 'finish':
      return {
        ground: roll < 0.5 ? SPRITES.sand : SPRITES.stone,
        prop: index === totalCells - 1 ? SPRITES.chestOpen : SPRITES.chestClosed,
      };
  }
}

type PathStyle = 'snake' | 'meander' | 'switchback';

/**
 * Рандомный маршрут (seeded): стиль, ширина, повороты, смещения.
 * Один seed → стабильная карта между reload.
 */
export function generatePath(totalCells: number, seed: number): Point[] {
  const rng = createRng(seed || 1);
  const styleRoll = rng();
  const style: PathStyle =
    styleRoll < 0.34 ? 'snake' : styleRoll < 0.67 ? 'meander' : 'switchback';

  const cols = Math.max(
    3,
    Math.min(10, Math.round(Math.sqrt(totalCells) * (0.9 + rng() * 1.1))),
  );
  const step = CELL_PX * (0.85 + rng() * 0.35);
  const wobbleAmp = CELL_PX * (0.15 + rng() * 0.55);
  const wobbleFreq = 0.35 + rng() * 1.2;

  if (style === 'meander') {
    return generateMeander(totalCells, rng, step, wobbleAmp);
  }
  if (style === 'switchback') {
    return generateSwitchback(totalCells, rng, cols, step, wobbleAmp, wobbleFreq);
  }
  return generateSnake(totalCells, rng, cols, step, wobbleAmp, wobbleFreq);
}

function generateSnake(
  totalCells: number,
  rng: () => number,
  cols: number,
  step: number,
  wobbleAmp: number,
  wobbleFreq: number,
): Point[] {
  const points: Point[] = [];
  let col = Math.floor(rng() * cols);
  let row = 0;
  let dir = rng() < 0.5 ? 1 : -1;
  const rowGap = step * (0.85 + rng() * 0.4);

  for (let i = 0; i < totalCells; i++) {
    // иногда ранний поворот
    if (i > 0 && rng() < 0.08) {
      dir *= -1;
      row += 1;
    }

    const wobbleX = (rng() - 0.5) * wobbleAmp * 0.35;
    const wobbleY =
      Math.sin(i * wobbleFreq + rng() * 0.01) * wobbleAmp + (rng() - 0.5) * step * 0.2;

    points.push({
      x: col * step + wobbleX,
      y: row * rowGap + wobbleY,
    });

    const nextCol = col + dir;
    if (nextCol < 0 || nextCol >= cols || rng() < 0.04) {
      dir *= -1;
      row += 1;
      if (nextCol < 0) col = 0;
      else if (nextCol >= cols) col = cols - 1;
    } else {
      col = nextCol;
    }
  }

  return points;
}

function generateSwitchback(
  totalCells: number,
  rng: () => number,
  cols: number,
  step: number,
  wobbleAmp: number,
  wobbleFreq: number,
): Point[] {
  const points: Point[] = [];
  let col = 0;
  let row = 0;
  let dir = 1;
  const segmentLen = Math.max(2, Math.floor(2 + rng() * (cols - 1)));
  let leftInSeg = segmentLen;
  const rowGap = step * (0.75 + rng() * 0.5);

  for (let i = 0; i < totalCells; i++) {
    const wobble =
      Math.sin(i * wobbleFreq) * wobbleAmp + (rng() - 0.5) * wobbleAmp * 0.5;

    points.push({
      x: col * step + (rng() - 0.5) * step * 0.15,
      y: row * rowGap + wobble,
    });

    leftInSeg -= 1;
    if (leftInSeg <= 0 || col + dir < 0 || col + dir >= cols) {
      dir *= -1;
      row += 1;
      leftInSeg = Math.max(2, Math.floor(2 + rng() * cols));
    } else {
      col += dir;
    }
  }

  return points;
}

/** Пьяный шаг с дрейфом вперёд-вправо */
function generateMeander(
  totalCells: number,
  rng: () => number,
  step: number,
  wobbleAmp: number,
): Point[] {
  const points: Point[] = [];
  let x = 0;
  let y = 0;
  let angle = -Math.PI / 2 + (rng() - 0.5) * 0.8; // вверх с шумом

  const turnChance = 0.18 + rng() * 0.25;
  const turnSize = 0.35 + rng() * 0.9;

  for (let i = 0; i < totalCells; i++) {
    points.push({
      x: x + (rng() - 0.5) * wobbleAmp * 0.3,
      y: y + (rng() - 0.5) * wobbleAmp * 0.3,
    });

    if (rng() < turnChance) {
      angle += (rng() < 0.5 ? -1 : 1) * turnSize * (0.5 + rng());
    }
    // мягкий bias «вперёд» по карте (вниз-вправо)
    angle += (rng() - 0.45) * 0.15;
    // clamp extreme loops
    const preferred = Math.atan2(1, 0.35);
    angle += (preferred - angle) * 0.05;

    x += Math.cos(angle) * step;
    y += Math.sin(angle) * step;
  }

  return points;
}

/** Интерполяция позиции вдоль пути по progress 0..1 */
export function samplePath(points: Point[], progress: number): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  const t = Math.min(1, Math.max(0, progress)) * (points.length - 1);
  const i = Math.floor(t);
  const f = t - i;
  const a = points[i];
  const b = points[Math.min(points.length - 1, i + 1)];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
  };
}

export function pathBounds(points: Point[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  }
  return { minX, minY, maxX, maxY };
}

export interface WanderNpc {
  cellIndex: number;
  npcIndex: number;
  offsetX: number;
  offsetY: number;
}

/** Бродячие NPC — тот же seed, что и на большой карте */
export function generateWanderers(
  totalCells: number,
  mapSeed: number,
  reservedCells: number[],
): WanderNpc[] {
  const rng = createRng(mapSeed ^ 0x85ebca6b);
  const reserved = new Set(reservedCells);
  const list: WanderNpc[] = [];
  const count = Math.min(8, Math.max(2, Math.floor(totalCells / 8)));
  const npcPool = [0, 2, 3, 4, 5, 6, 7];
  let guard = 0;
  while (list.length < count && guard < 80) {
    guard += 1;
    const cellIndex = 1 + Math.floor(rng() * Math.max(1, totalCells - 2));
    if (reserved.has(cellIndex)) continue;
    reserved.add(cellIndex);
    list.push({
      cellIndex,
      npcIndex: npcPool[Math.floor(rng() * npcPool.length)],
      offsetX: (rng() - 0.5) * CELL_PX * 0.5,
      offsetY: (rng() - 0.5) * CELL_PX * 0.35,
    });
  }
  return list;
}
