import { useState } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import { ITEM_LABELS, PRICES } from '../../utils/constants';
import { buildShareMessage, daysSince, formatMoney } from '../../utils/helpers';
import { StatsPanel } from '../Game/StatsPanel';

export function VictoryScreen() {
  const { state, resetGame } = useGameLogic();
  const [toast, setToast] = useState('');
  const days = daysSince(state.startedAt);

  const share = async () => {
    const message = buildShareMessage(state.goalName, state.goalAmount, days);
    try {
      if (navigator.share) {
        await navigator.share({ text: message, title: 'Pip-Boy Quest' });
        setToast('TRANSMITTED');
        return;
      }
    } catch {
      // cancelled
    }

    try {
      await navigator.clipboard.writeText(message);
      setToast('COPIED TO HOLOTAPE');
    } catch {
      setToast(message);
    }
  };

  return (
    <div className="panel">
      <div className="victory-hero">
        <h1>Quest Complete</h1>
        <p>
          Objective "{state.goalName}" secured in {days} day
          {days === 1 ? '' : 's'}.
        </p>
        <p className="muted" style={{ marginTop: 8 }}>
          Vault savings {formatMoney(state.saved)} / {formatMoney(state.goalAmount)}
        </p>
      </div>

      <StatsPanel
        coffeeSaves={state.coffeeSaves}
        coffeeBuys={state.coffeeBuys ?? 0}
        cigaretteSaves={state.cigaretteSaves}
        cigaretteBuys={state.cigaretteBuys}
        energySaves={state.energySaves ?? 0}
        energyBuys={state.energyBuys ?? 0}
      />

      <div className="stats-list" style={{ margin: '12px 0' }}>
        <div className="stat-row">
          <span>{ITEM_LABELS.coffee.spent}</span>
          <span>−{formatMoney((state.coffeeBuys ?? 0) * PRICES.coffee)}</span>
        </div>
        <div className="stat-row">
          <span>{ITEM_LABELS.cigarettes.spent}</span>
          <span>−{formatMoney(state.cigaretteBuys * PRICES.cigarettes)}</span>
        </div>
        <div className="stat-row">
          <span>{ITEM_LABELS.energy.spent}</span>
          <span>−{formatMoney((state.energyBuys ?? 0) * PRICES.energy)}</span>
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={share}>
          Broadcast
        </button>
        <button type="button" className="btn btn-danger" onClick={resetGame}>
          New objective
        </button>
      </div>
      <div className="toast">{toast}</div>
    </div>
  );
}
