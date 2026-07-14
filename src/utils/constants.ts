export const PRICES = {
  coffee: 370, // Nuka-Cola
  cigarettes: 70,
  energy: 150, // Jet
} as const;

/** 1 клетка карты = 1000₽ */
export const CELL_SIZE = 1000;

export const STORAGE_KEY = 'kopilka-game';

export const TILE = 16;
export const CELL_PX = 48;

/** UI labels (keys stay coffee/cigarettes/energy in state) */
export const ITEM_LABELS = {
  coffee: {
    short: 'Coffee',
    did: 'Bought coffee',
    skipped: 'Skipped coffee',
    confirmBuy: 'Buy coffee',
    spent: 'Spent on coffee',
    skippedStat: 'Coffee skipped',
    boughtStat: 'Coffee bought',
  },
  cigarettes: {
    short: 'Cigarettes',
    did: 'Bought cigarettes',
    skipped: 'Skipped cigarettes',
    confirmBuy: 'Buy cigarettes',
    spent: 'Spent on cigarettes',
    skippedStat: 'Cigarettes skipped',
    boughtStat: 'Cigarettes bought',
  },
  energy: {
    short: 'Energy',
    did: 'Bought energy',
    skipped: 'Skipped energy',
    confirmBuy: 'Buy energy',
    spent: 'Spent on energy',
    skippedStat: 'Energy skipped',
    boughtStat: 'Energy bought',
  },
} as const;
