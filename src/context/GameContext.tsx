import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEY } from '../utils/constants';
import { gameReducer } from './gameReducer';
import { initialGameState, type GameAction, type GameState } from './types';

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [savedState, setSavedState] = useLocalStorage<GameState>(
    STORAGE_KEY,
    initialGameState,
  );
  const [state, dispatch] = useReducer(gameReducer, savedState, (loaded) => ({
    ...initialGameState,
    ...loaded,
    coffeeBuys: loaded.coffeeBuys ?? 0,
    energySaves: loaded.energySaves ?? 0,
    energyBuys: loaded.energyBuys ?? 0,
    claimedMilestones: loaded.claimedMilestones ?? [],
    lastMilestoneId: loaded.lastMilestoneId ?? null,
  }));

  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
