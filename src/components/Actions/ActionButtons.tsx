import { PRICES } from '../../utils/constants';
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
        `Buy coffee? −${formatMoney(PRICES.coffee)} from savings`,
      )
    ) {
      coffeeBuy();
    }
  };

  const onBuyCigarettes = () => {
    if (disabled) return;
    if (
      window.confirm(
        `Buy cigarettes? −${formatMoney(PRICES.cigarettes)} from savings`,
      )
    ) {
      cigaretteBuy();
    }
  };

  const onBuyEnergy = () => {
    if (disabled) return;
    if (
      window.confirm(
        `Buy an energy drink? −${formatMoney(PRICES.energy)} from savings`,
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
        🚬 Smoked
        <span className="btn-sub">−{formatMoney(PRICES.cigarettes)}</span>
      </button>
      <button type="button" className="btn" disabled={disabled} onClick={cigaretteSave}>
        🚬 Didn’t smoke
        <span className="btn-sub">+{formatMoney(PRICES.cigarettes)}</span>
      </button>

      <button
        type="button"
        className="btn btn-danger"
        disabled={disabled}
        onClick={onBuyCoffee}
      >
        ☕ Drank coffee
        <span className="btn-sub">−{formatMoney(PRICES.coffee)}</span>
      </button>
      <button type="button" className="btn" disabled={disabled} onClick={coffeeSave}>
        ☕ Didn’t drink coffee
        <span className="btn-sub">+{formatMoney(PRICES.coffee)}</span>
      </button>

      <button
        type="button"
        className="btn btn-danger"
        disabled={disabled}
        onClick={onBuyEnergy}
      >
        ⚡ Drank energy
        <span className="btn-sub">−{formatMoney(PRICES.energy)}</span>
      </button>
      <button type="button" className="btn" disabled={disabled} onClick={energySave}>
        ⚡ Didn’t drink energy
        <span className="btn-sub">+{formatMoney(PRICES.energy)}</span>
      </button>
    </div>
  );
}
