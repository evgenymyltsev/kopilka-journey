import { useEffect } from 'react';
import { ActionButtons } from '../Actions/ActionButtons';
import { useGame } from '../../context/GameContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import { formatMoney } from '../../utils/helpers';
import { hashSeed } from '../../utils/mapGenerator';
import { MILESTONE_DEFS } from '../../utils/rewards';
import { GameCanvas } from './GameCanvas';
import { ProgressBar } from './ProgressBar';
import { RewardsPanel } from './RewardsPanel';
import { StatsPanel } from './StatsPanel';

export function Game() {
  const { dispatch } = useGame();
  const { state, remaining, totalCells, currentCell } = useGameLogic();
  const mapSeed = hashSeed(state.goalName, state.goalAmount, state.startedAt);

  const toastMilestone = state.lastMilestoneId
    ? MILESTONE_DEFS.find((m) => m.id === state.lastMilestoneId)
    : null;

  useEffect(() => {
    if (!state.lastMilestoneId) return;
    const t = window.setTimeout(() => {
      dispatch({ type: 'CLEAR_MILESTONE_TOAST' });
    }, 3200);
    return () => window.clearTimeout(t);
  }, [state.lastMilestoneId, dispatch]);

  return (
    <>
      <div className="panel">
        <div className="brand">{state.goalName}</div>
        <div className="header-stats">
          <div>
            Goal
            <strong>{formatMoney(state.goalAmount)}</strong>
          </div>
          <div>
            Saved
            <strong>{formatMoney(state.saved)}</strong>
          </div>
          <div>
            Left
            <strong>{formatMoney(remaining)}</strong>
          </div>
        </div>
      </div>

      {toastMilestone && (
        <div className="milestone-toast panel">
          <strong>🎁 {toastMilestone.title}</strong>
          <div className="muted">{toastMilestone.blurb}</div>
        </div>
      )}

      <div className="panel">
        <ProgressBar saved={state.saved} goal={state.goalAmount} />
      </div>

      <GameCanvas
        saved={state.saved}
        goalAmount={state.goalAmount}
        totalCells={totalCells}
        currentCell={currentCell}
        mapSeed={mapSeed}
        claimedMilestones={state.claimedMilestones ?? []}
      />

      <ActionButtons />

      <RewardsPanel
        goalAmount={state.goalAmount}
        saved={state.saved}
        claimedIds={state.claimedMilestones ?? []}
      />

      <StatsPanel
        coffeeSaves={state.coffeeSaves}
        coffeeBuys={state.coffeeBuys ?? 0}
        cigaretteSaves={state.cigaretteSaves}
        cigaretteBuys={state.cigaretteBuys}
        energySaves={state.energySaves ?? 0}
        energyBuys={state.energyBuys ?? 0}
        totalSaved={state.totalSaved}
      />
    </>
  );
}
