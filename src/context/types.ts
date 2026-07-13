export type ActionKind =
  | 'coffee_save'
  | 'coffee_buy'
  | 'cigarette_save'
  | 'cigarette_buy'
  | 'energy_save'
  | 'energy_buy';

export interface ActionLog {
  action: ActionKind;
  amount: number;
  timestamp: number;
}

export interface GameState {
  goalName: string;
  goalAmount: number;
  saved: number;
  totalSaved: number;
  totalSpent: number;
  coffeeSaves: number;
  coffeeBuys: number;
  cigaretteSaves: number;
  cigaretteBuys: number;
  energySaves: number;
  energyBuys: number;
  history: ActionLog[];
  claimedMilestones: string[];
  lastMilestoneId: string | null;
  isGameOver: boolean;
  isVictory: boolean;
  isFirstLaunch: boolean;
  startedAt: number | null;
}

export type GameAction =
  | { type: 'SET_GOAL'; payload: { name: string; amount: number } }
  | { type: 'COFFEE_SAVE' }
  | { type: 'COFFEE_BUY' }
  | { type: 'CIGARETTE_SAVE' }
  | { type: 'CIGARETTE_BUY' }
  | { type: 'ENERGY_SAVE' }
  | { type: 'ENERGY_BUY' }
  | { type: 'CLEAR_MILESTONE_TOAST' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; payload: GameState };

export const initialGameState: GameState = {
  goalName: '',
  goalAmount: 0,
  saved: 0,
  totalSaved: 0,
  totalSpent: 0,
  coffeeSaves: 0,
  coffeeBuys: 0,
  cigaretteSaves: 0,
  cigaretteBuys: 0,
  energySaves: 0,
  energyBuys: 0,
  history: [],
  claimedMilestones: [],
  lastMilestoneId: null,
  isGameOver: false,
  isVictory: false,
  isFirstLaunch: true,
  startedAt: null,
};
