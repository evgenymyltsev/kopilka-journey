import { useState, type FormEvent } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';

export function GoalSetup() {
  const { setGoal } = useGameLogic();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('100000');
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(/\s/g, ''));
    if (!name.trim()) {
      setError('Enter a goal name');
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    setError('');
    setGoal(name, value);
  };

  return (
    <div className="panel">
      <div className="brand">Pip-Boy · Path to Goal</div>
      <p className="muted" style={{ textAlign: 'center', marginBottom: 16 }}>
        Skip coffee, smokes, and energy drinks — walk the wasteland to your goal.
      </p>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="goal-name">Goal name</label>
          <input
            id="goal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New laptop"
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="goal-amount">Goal amount (₽)</label>
          <input
            id="goal-amount"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100000"
          />
          {error && <span className="error">{error}</span>}
        </div>
        <button type="submit" className="btn btn-primary">
          Start the journey
        </button>
      </form>
    </div>
  );
}
