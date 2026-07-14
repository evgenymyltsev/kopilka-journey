import { ITEM_LABELS, PRICES } from '../../utils/constants';
import { formatMoney } from '../../utils/helpers';

interface StatsPanelProps {
  coffeeSaves: number;
  coffeeBuys: number;
  cigaretteSaves: number;
  cigaretteBuys: number;
  energySaves: number;
  energyBuys: number;
}

export function StatsPanel({
  coffeeSaves,
  coffeeBuys,
  cigaretteSaves,
  cigaretteBuys,
  energySaves,
  energyBuys,
}: StatsPanelProps) {
  const skipped =
    coffeeSaves * PRICES.coffee +
    cigaretteSaves * PRICES.cigarettes +
    energySaves * PRICES.energy;
  const spent =
    coffeeBuys * PRICES.coffee +
    cigaretteBuys * PRICES.cigarettes +
    energyBuys * PRICES.energy;
  const net = skipped - spent;

  return (
    <div className="panel">
      <div className="panel-title">Pip-Boy Ledger</div>
      <div className="stats-list">
        <div className="stat-row">
          <span>☢ {ITEM_LABELS.coffee.skippedStat}</span>
          <span>
            {coffeeSaves}× ({formatMoney(coffeeSaves * PRICES.coffee)})
          </span>
        </div>
        <div className="stat-row">
          <span>☢ {ITEM_LABELS.coffee.boughtStat}</span>
          <span>
            {coffeeBuys}× (−{formatMoney(coffeeBuys * PRICES.coffee)})
          </span>
        </div>
        <div className="stat-row">
          <span>🚬 {ITEM_LABELS.cigarettes.skippedStat}</span>
          <span>
            {cigaretteSaves}× ({formatMoney(cigaretteSaves * PRICES.cigarettes)})
          </span>
        </div>
        <div className="stat-row">
          <span>🚬 {ITEM_LABELS.cigarettes.boughtStat}</span>
          <span>
            {cigaretteBuys}× (−{formatMoney(cigaretteBuys * PRICES.cigarettes)})
          </span>
        </div>
        <div className="stat-row">
          <span>💉 {ITEM_LABELS.energy.skippedStat}</span>
          <span>
            {energySaves}× ({formatMoney(energySaves * PRICES.energy)})
          </span>
        </div>
        <div className="stat-row">
          <span>💉 {ITEM_LABELS.energy.boughtStat}</span>
          <span>
            {energyBuys}× (−{formatMoney(energyBuys * PRICES.energy)})
          </span>
        </div>
        <div className="stat-row total">
          <span>Net caps</span>
          <span>
            {net < 0 ? '−' : ''}
            {formatMoney(Math.abs(net))}
          </span>
        </div>
      </div>
    </div>
  );
}
