import { useEffect, useMemo, useRef, useState } from 'react';
import { ActionButtons } from '../Actions/ActionButtons';
import { useGame } from '../../context/GameContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import { formatMoney } from '../../utils/helpers';
import {
  generateWanderers,
  hashSeed,
} from '../../utils/mapGenerator';
import { getNpcProfile, pickNpcLine } from '../../utils/npcDialogue';
import { MILESTONE_DEFS, placeMilestones } from '../../utils/rewards';
import { GameCanvas, type CanvasSpeech } from './GameCanvas';
import { ProgressBar } from './ProgressBar';
import { RewardsPanel } from './RewardsPanel';
import { StatsPanel } from './StatsPanel';

export function Game() {
  const { dispatch } = useGame();
  const { state, remaining, totalCells, currentCell } = useGameLogic();
  const mapSeed = hashSeed(state.goalName, state.goalAmount, state.startedAt);

  const milestones = useMemo(
    () => placeMilestones(state.goalAmount, totalCells),
    [state.goalAmount, totalCells],
  );

  const wanderers = useMemo(
    () =>
      generateWanderers(
        totalCells,
        mapSeed,
        milestones.map((m) => m.cellIndex),
      ),
    [totalCells, mapSeed, milestones],
  );

  const toastMilestone = state.lastMilestoneId
    ? MILESTONE_DEFS.find((m) => m.id === state.lastMilestoneId)
    : null;

  const [speech, setSpeech] = useState<CanvasSpeech | null>(null);
  const metRef = useRef<Set<string>>(new Set());
  const prevCellRef = useRef(currentCell);

  useEffect(() => {
    metRef.current = new Set();
    prevCellRef.current = 0;
    setSpeech(null);
  }, [mapSeed]);

  useEffect(() => {
    if (!state.lastMilestoneId) return;
    const t = window.setTimeout(() => {
      dispatch({ type: 'CLEAR_MILESTONE_TOAST' });
    }, 3200);
    return () => window.clearTimeout(t);
  }, [state.lastMilestoneId, dispatch]);

  useEffect(() => {
    const prev = prevCellRef.current;
    prevCellRef.current = currentCell;
    if (currentCell < prev) return;

    const encounters: CanvasSpeech[] = [];

    for (const npc of wanderers) {
      if (npc.cellIndex > prev && npc.cellIndex <= currentCell) {
        if (!metRef.current.has(npc.key)) {
          metRef.current.add(npc.key);
          encounters.push({
            key: npc.key,
            name: npc.name,
            line: npc.line,
            cellIndex: npc.cellIndex,
            offsetX: npc.offsetX,
            offsetY: npc.offsetY,
            kind: 'wander',
          });
        }
      }
    }

    for (const m of milestones) {
      const key = `milestone-${m.def.id}`;
      if (m.cellIndex > prev && m.cellIndex <= currentCell) {
        if (!metRef.current.has(key)) {
          metRef.current.add(key);
          const profile = getNpcProfile(m.def.npcIndex);
          encounters.push({
            key,
            name: profile.name,
            line: pickNpcLine(m.def.npcIndex, mapSeed, m.cellIndex),
            cellIndex: m.cellIndex,
            kind: 'milestone',
          });
        }
      }
    }

    if (encounters.length === 0) return;
    setSpeech(encounters[encounters.length - 1]);
  }, [currentCell, wanderers, milestones, mapSeed]);

  useEffect(() => {
    if (!speech) return;
    const t = window.setTimeout(() => setSpeech(null), 4500);
    return () => window.clearTimeout(t);
  }, [speech]);

  return (
    <>
      <div className="panel">
        <div className="brand">{state.goalName}</div>
        <div className="header-stats">
          <div>
            Objective
            <strong>{formatMoney(state.goalAmount)}</strong>
          </div>
          <div>
            Caps
            <strong>{formatMoney(state.saved)}</strong>
          </div>
          <div>
            Remaining
            <strong>{formatMoney(remaining)}</strong>
          </div>
        </div>
      </div>

      {toastMilestone && (
        <div className="milestone-toast panel">
          <strong>☢ {toastMilestone.title}</strong>
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
        speech={speech}
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
      />
    </>
  );
}
