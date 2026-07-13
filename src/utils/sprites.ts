import { TILE } from './constants';

export type SheetName = 'terrain' | 'characters' | 'objects' | 'extras';

export interface SpriteRect {
  sheet: SheetName;
  x: number;
  y: number;
  w: number;
  h: number;
}

const t = (col: number, row: number, w = 1, h = 1): SpriteRect => ({
  sheet: 'terrain',
  x: col * TILE,
  y: row * TILE,
  w: w * TILE,
  h: h * TILE,
});

const o = (col: number, row: number, w = 1, h = 1): SpriteRect => ({
  sheet: 'objects',
  x: col * TILE,
  y: row * TILE,
  w: w * TILE,
  h: h * TILE,
});

/** Atlas для basictiles / characters / objects (16×16) */
export const SPRITES = {
  grass: t(3, 1),
  grassAlt: t(4, 1),
  dirt: t(0, 2),
  sand: t(7, 0),
  stone: t(0, 0),
  brick: t(4, 0),
  wood: t(0, 3),
  water: t(5, 1),
  tree: t(0, 8, 1, 2),
  treeAlt: t(1, 8, 1, 2),
  bush: t(3, 13),
  rock: t(4, 8),
  pillar: t(6, 3),
  wall: t(1, 0),
  stairs: t(7, 3),
  sign: t(5, 6),
  campfire: t(4, 6),

  chestClosed: o(6, 0),
  chestOpen: o(6, 2),
  pot: o(9, 0),
  potAlt: o(10, 1),
  door: o(0, 0),
  torch: o(0, 4),
  fireplace: o(9, 4),
} as const;

/** Игрок: characters[1,0] — коричневые волосы / сине-фиолетовая рубашка */
const PLAYER_OX = 48;
const PLAYER_OY = 0;

export function playerFrame(walkFrame: number): SpriteRect {
  const frame = ((walkFrame % 3) + 3) % 3;
  return {
    sheet: 'characters',
    x: PLAYER_OX + frame * TILE,
    y: PLAYER_OY, // facing down
    w: TILE,
    h: TILE,
  };
}

const SHEET_URLS: Record<SheetName, string> = {
  terrain: '/assets/sprites/terrain.png',
  characters: '/assets/sprites/characters.png',
  objects: '/assets/sprites/objects.png',
  extras: '/assets/sprites/extras.png',
};

export type SheetMap = Record<SheetName, HTMLCanvasElement | HTMLImageElement>;

/** Color-key чистого чёрного → прозрачность (на случай RGB-листов). */
export async function loadSpriteSheets(): Promise<SheetMap> {
  const entries = await Promise.all(
    (Object.keys(SHEET_URLS) as SheetName[]).map(async (name) => {
      const img = await loadImage(SHEET_URLS[name]);
      return [name, colorKeyBlack(img)] as const;
    }),
  );
  return Object.fromEntries(entries) as SheetMap;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function colorKeyBlack(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sheets: SheetMap,
  sprite: SpriteRect,
  dx: number,
  dy: number,
  dw?: number,
  dh?: number,
  alpha = 1,
) {
  const sheet = sheets[sprite.sheet];
  if (!sheet) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    sheet,
    sprite.x,
    sprite.y,
    sprite.w,
    sprite.h,
    dx,
    dy,
    dw ?? sprite.w,
    dh ?? sprite.h,
  );
  ctx.restore();
}
