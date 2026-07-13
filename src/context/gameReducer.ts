import { PRICES } from '../utils/constants';
import { newlyReachedMilestones } from '../utils/rewards';
import {
  type GameAction,
  type GameState,
  initialGameState,
} from './types';

function withVictory(
  state: GameState,
  nextSaved: number,
): Pick<GameState, 'saved' | 'isVictory' | 'isGameOver'> {
  const reached = nextSaved >= state.goalAmount && state.goalAmount > 0;
  return {
    saved: Math.min(nextSaved, state.goalAmount),
    isVictory: reached,
    isGameOver: reached,
  };
}

function applyMilestones(
  state: GameState,
  prevSaved: number,
  nextSaved: number,
): Pick<GameState, 'claimedMilestones' | 'lastMilestoneId'> {
  const unlocked = newlyReachedMilestones(
    prevSaved,
    nextSaved,
    state.goalAmount,
    state.claimedMilestones ?? [],
  );
  if (unlocked.length === 0) {
    return {
      claimedMilestones: state.claimedMilestones ?? [],
      lastMilestoneId: state.lastMilestoneId ?? null,
    };
  }
  return {
    claimedMilestones: [
      ...(state.claimedMilestones ?? []),
      ...unlocked.map((m) => m.id),
    ],
    lastMilestoneId: unlocked[unlocked.length - 1].id,
  };
}

function normalizeLoaded(state: GameState): GameState {
  return {
    ...initialGameState,
    ...state,
    coffeeBuys: state.coffeeBuys ?? 0,
    energySaves: state.energySaves ?? 0,
    energyBuys: state.energyBuys ?? 0,
    claimedMilestones: state.claimedMilestones ?? [],
    lastMilestoneId: state.lastMilestoneId ?? null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_GAME':
      return normalizeLoaded(action.payload);

    case 'SET_GOAL': {
      const { name, amount } = action.payload;
      return {
        ...initialGameState,
        goalName: name.trim(),
        goalAmount: amount,
        isFirstLaunch: false,
        startedAt: Date.now(),
      };
    }

    case 'COFFEE_SAVE': {
      if (state.isVictory || state.saved >= state.goalAmount) return state;
      const amount = PRICES.coffee;
      const prevSaved = state.saved;
      const nextSaved = state.saved + amount;
      return {
        ...state,
        ...withVictory(state, nextSaved),
        ...applyMilestones(state, prevSaved, Math.min(nextSaved, state.goalAmount)),
        totalSaved: state.totalSaved + amount,
        coffeeSaves: state.coffeeSaves + 1,
        history: [
          ...state.history,
          { action: 'coffee_save', amount, timestamp: Date.now() },
        ],
      };
    }

    case 'CIGARETTE_SAVE': {
      if (state.isVictory || state.saved >= state.goalAmount) return state;
      const amount = PRICES.cigarettes;
      const prevSaved = state.saved;
      const nextSaved = state.saved + amount;
      return {
        ...state,
        ...withVictory(state, nextSaved),
        ...applyMilestones(state, prevSaved, Math.min(nextSaved, state.goalAmount)),
        totalSaved: state.totalSaved + amount,
        cigaretteSaves: state.cigaretteSaves + 1,
        history: [
          ...state.history,
          { action: 'cigarette_save', amount, timestamp: Date.now() },
        ],
      };
    }

    case 'CIGARETTE_BUY': {
      if (state.isVictory) return state;
      const amount = PRICES.cigarettes;
      const nextSaved = Math.max(0, state.saved - amount);
      return {
        ...state,
        saved: nextSaved,
        totalSpent: state.totalSpent + amount,
        cigaretteBuys: (state.cigaretteBuys ?? 0) + 1,
        isVictory: false,
        isGameOver: false,
        history: [
          ...state.history,
          { action: 'cigarette_buy', amount: -amount, timestamp: Date.now() },
        ],
      };
    }

    case 'COFFEE_BUY': {
      if (state.isVictory) return state;
      const amount = PRICES.coffee;
      const nextSaved = Math.max(0, state.saved - amount);
      return {
        ...state,
        saved: nextSaved,
        totalSpent: state.totalSpent + amount,
        coffeeBuys: (state.coffeeBuys ?? 0) + 1,
        isVictory: false,
        isGameOver: false,
        history: [
          ...state.history,
          { action: 'coffee_buy', amount: -amount, timestamp: Date.now() },
        ],
      };
    }

    case 'ENERGY_SAVE': {
      if (state.isVictory || state.saved >= state.goalAmount) return state;
      const amount = PRICES.energy;
      const prevSaved = state.saved;
      const nextSaved = state.saved + amount;
      return {
        ...state,
        ...withVictory(state, nextSaved),
        ...applyMilestones(state, prevSaved, Math.min(nextSaved, state.goalAmount)),
        totalSaved: state.totalSaved + amount,
        energySaves: (state.energySaves ?? 0) + 1,
        history: [
          ...state.history,
          { action: 'energy_save', amount, timestamp: Date.now() },
        ],
      };
    }

    case 'ENERGY_BUY': {
      if (state.isVictory) return state;
      const amount = PRICES.energy;
      const nextSaved = Math.max(0, state.saved - amount);
      return {
        ...state,
        saved: nextSaved,
        totalSpent: state.totalSpent + amount,
        energyBuys: (state.energyBuys ?? 0) + 1,
        isVictory: false,
        isGameOver: false,
        history: [
          ...state.history,
          { action: 'energy_buy', amount: -amount, timestamp: Date.now() },
        ],
      };
    }

    case 'CLEAR_MILESTONE_TOAST':
      return { ...state, lastMilestoneId: null };

    case 'RESET_GAME':
      return { ...initialGameState };

    default:
      return state;
  }
}
