import { useCallback, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { CELL_SIZE, PRICES } from '../utils/constants';

export function useGameLogic() {
  const { state, dispatch } = useGame();

  const remaining = Math.max(0, state.goalAmount - state.saved);
  const progress =
    state.goalAmount > 0
      ? Math.min(100, (state.saved / state.goalAmount) * 100)
      : 0;
  const totalCells = Math.max(1, Math.ceil(state.goalAmount / CELL_SIZE));
  const currentCell = Math.min(
    totalCells - 1,
    Math.floor(state.saved / CELL_SIZE),
  );

  const setGoal = useCallback(
    (name: string, amount: number) => {
      dispatch({ type: 'SET_GOAL', payload: { name, amount } });
    },
    [dispatch],
  );

  const coffeeSave = useCallback(() => dispatch({ type: 'COFFEE_SAVE' }), [dispatch]);
  const coffeeBuy = useCallback(() => dispatch({ type: 'COFFEE_BUY' }), [dispatch]);
  const cigaretteSave = useCallback(
    () => dispatch({ type: 'CIGARETTE_SAVE' }),
    [dispatch],
  );
  const cigaretteBuy = useCallback(
    () => dispatch({ type: 'CIGARETTE_BUY' }),
    [dispatch],
  );
  const energySave = useCallback(() => dispatch({ type: 'ENERGY_SAVE' }), [dispatch]);
  const energyBuy = useCallback(() => dispatch({ type: 'ENERGY_BUY' }), [dispatch]);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), [dispatch]);

  return useMemo(
    () => ({
      state,
      remaining,
      progress,
      totalCells,
      currentCell,
      prices: PRICES,
      setGoal,
      coffeeSave,
      coffeeBuy,
      cigaretteSave,
      cigaretteBuy,
      energySave,
      energyBuy,
      resetGame,
    }),
    [
      state,
      remaining,
      progress,
      totalCells,
      currentCell,
      setGoal,
      coffeeSave,
      coffeeBuy,
      cigaretteSave,
      cigaretteBuy,
      energySave,
      energyBuy,
      resetGame,
    ],
  );
}
