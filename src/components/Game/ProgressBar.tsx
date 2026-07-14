import { formatMoney } from '../../utils/helpers';

interface ProgressBarProps {
  saved: number;
  goal: number;
}

export function ProgressBar({ saved, goal }: ProgressBarProps) {
  const progress = goal > 0 ? Math.min((saved / goal) * 100, 100) : 0;

  return (
    <div>
      <div className="progress-label">
        <span>◈ {formatMoney(saved)}</span>
        <span>⚑ {formatMoney(goal)}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-percent">{progress.toFixed(1)}%</div>
    </div>
  );
}
