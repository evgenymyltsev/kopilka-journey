import { PRICES } from '../../utils/constants';
import { formatMoney } from '../../utils/helpers';

interface StatsPanelProps {
  coffeeSaves: number;
  coffeeBuys: number;
  cigaretteSaves: number;
  cigaretteBuys: number;
  energySaves: number;
  energyBuys: number;
  totalSaved: number;
}

export function StatsPanel({
  coffeeSaves,
  coffeeBuys,
  cigaretteSaves,
  cigaretteBuys,
  energySaves,
  energyBuys,
  totalSaved,
}: StatsPanelProps) {
  return (
    <div className="panel">
      <div className="panel-title">Stats</div>
      <div className="stats-list">
        <div className="stat-row">
          <span>☕ Coffee skipped</span>
          <span>
            {coffeeSaves}× ({formatMoney(coffeeSaves * PRICES.coffee)})
          </span>
        </div>
        <div className="stat-row">
          <span>☕ Coffee bought</span>
          <span>
            {coffeeBuys}× (−{formatMoney(coffeeBuys * PRICES.coffee)})
          </span>
        </div>
        <div className="stat-row">
          <span>🚬 Cigarettes skipped</span>
          <span>
            {cigaretteSaves}× ({formatMoney(cigaretteSaves * PRICES.cigarettes)})
          </span>
        </div>
        <div className="stat-row">
          <span>🚬 Cigarettes bought</span>
          <span>
            {cigaretteBuys}× (−{formatMoney(cigaretteBuys * PRICES.cigarettes)})
          </span>
        </div>
        <div className="stat-row">
          <span>⚡ Energy drinks skipped</span>
          <span>
            {energySaves}× ({formatMoney(energySaves * PRICES.energy)})
          </span>
        </div>
        <div className="stat-row">
          <span>⚡ Energy drinks bought</span>
          <span>
            {energyBuys}× (−{formatMoney(energyBuys * PRICES.energy)})
          </span>
        </div>
        <div className="stat-row total">
          <span>Total saved</span>
          <span>{formatMoney(totalSaved)}</span>
        </div>
      </div>
    </div>
  );
}
