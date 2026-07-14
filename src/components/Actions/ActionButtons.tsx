import { ITEM_LABELS, PRICES } from '../../utils/constants';
import { formatMoney } from '../../utils/helpers';
import { useGameLogic } from '../../hooks/useGameLogic';

export function ActionButtons() {
  const {
    state,
    coffeeSave,
    coffeeBuy,
    cigaretteSave,
    cigaretteBuy,
    energySave,
    energyBuy,
  } = useGameLogic();
  const disabled = state.isVictory;

  const onBuyCoffee = () => {
    if (disabled) return;
    if (
      window.confirm(
        `${ITEM_LABELS.coffee.confirmBuy}? −${formatMoney(PRICES.coffee)} from vault savings`,
      )
    ) {
      coffeeBuy();
    }
  };

  const onBuyCigarettes = () => {
    if (disabled) return;
    if (
      window.confirm(
        `${ITEM_LABELS.cigarettes.confirmBuy}? −${formatMoney(PRICES.cigarettes)} from vault savings`,
      )
    ) {
      cigaretteBuy();
    }
  };

  const onBuyEnergy = () => {
    if (disabled) return;
    if (
      window.confirm(
        `${ITEM_LABELS.energy.confirmBuy}? −${formatMoney(PRICES.energy)} from vault savings`,
      )
    ) {
      energyBuy();
    }
  };

  return (
    <div className="action-grid">
      <button
        type="button"
        className="btn btn-danger"
        disabled={disabled}
        onClick={onBuyCigarettes}
      >
        🚬 {ITEM_LABELS.cigarettes.did}
        <span className="btn-sub">−{formatMoney(PRICES.cigarettes)}</span>
      </button>
      <button type="button" className="btn" disabled={disabled} onClick={cigaretteSave}>
        🚬 {ITEM_LABELS.cigarettes.skipped}
        <span className="btn-sub">+{formatMoney(PRICES.cigarettes)}</span>
      </button>

      <button
        type="button"
        className="btn btn-danger"
        disabled={disabled}
        onClick={onBuyCoffee}
      >
        ☢ {ITEM_LABELS.coffee.did}
        <span className="btn-sub">−{formatMoney(PRICES.coffee)}</span>
      </button>
      <button type="button" className="btn" disabled={disabled} onClick={coffeeSave}>
        ☢ {ITEM_LABELS.coffee.skipped}
        <span className="btn-sub">+{formatMoney(PRICES.coffee)}</span>
      </button>

      <button
        type="button"
        className="btn btn-danger"
        disabled={disabled}
        onClick={onBuyEnergy}
      >
        💉 {ITEM_LABELS.energy.did}
        <span className="btn-sub">−{formatMoney(PRICES.energy)}</span>
      </button>
      <button type="button" className="btn" disabled={disabled} onClick={energySave}>
        💉 {ITEM_LABELS.energy.skipped}
        <span className="btn-sub">+{formatMoney(PRICES.energy)}</span>
      </button>
    </div>
  );
}
