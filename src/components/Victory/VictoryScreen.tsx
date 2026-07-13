import { useState } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import { PRICES } from '../../utils/constants';
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
        await navigator.share({ text: message, title: 'Piggy Bank' });
        setToast('Shared');
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(message);
      setToast('Copied to clipboard');
    } catch {
      setToast(message);
    }
  };

  return (
    <div className="panel">
      <div className="victory-hero">
        <h1>Victory!</h1>
        <p>
          Goal "{state.goalName}" reached in {days} day{days === 1 ? '' : 's'}.
        </p>
        <p className="muted" style={{ marginTop: 8 }}>
          Saved {formatMoney(state.saved)} of {formatMoney(state.goalAmount)}
        </p>
      </div>

      <StatsPanel
        coffeeSaves={state.coffeeSaves}
        coffeeBuys={state.coffeeBuys ?? 0}
        cigaretteSaves={state.cigaretteSaves}
        cigaretteBuys={state.cigaretteBuys}
        energySaves={state.energySaves ?? 0}
        energyBuys={state.energyBuys ?? 0}
        totalSaved={state.totalSaved}
      />

      <div className="stats-list" style={{ margin: '12px 0' }}>
        <div className="stat-row">
          <span>Spent on coffee</span>
          <span>−{formatMoney((state.coffeeBuys ?? 0) * PRICES.coffee)}</span>
        </div>
        <div className="stat-row">
          <span>Spent on cigarettes</span>
          <span>−{formatMoney(state.cigaretteBuys * PRICES.cigarettes)}</span>
        </div>
        <div className="stat-row">
          <span>Spent on energy drinks</span>
          <span>−{formatMoney((state.energyBuys ?? 0) * PRICES.energy)}</span>
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn" onClick={share}>
          Share
        </button>
        <button type="button" className="btn btn-danger" onClick={resetGame}>
          New goal
        </button>
      </div>
      <div className="toast">{toast}</div>
    </div>
  );
}
