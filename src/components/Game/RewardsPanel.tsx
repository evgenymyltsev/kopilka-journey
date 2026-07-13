import { MILESTONE_DEFS, type MilestoneDef } from '../../utils/rewards';
import { formatMoney } from '../../utils/helpers';

interface RewardsPanelProps {
  goalAmount: number;
  saved: number;
  claimedIds: string[];
}

export function RewardsPanel({
  goalAmount,
  saved,
  claimedIds,
}: RewardsPanelProps) {
  const claimed = new Set(claimedIds);
  const list = MILESTONE_DEFS.filter((m) => m.threshold < goalAmount);

  if (list.length === 0) return null;

  return (
    <div className="panel">
      <div className="panel-title">Rewards along the path</div>
      <div className="rewards-list">
        {list.map((m) => (
          <RewardRow
            key={m.id}
            milestone={m}
            done={claimed.has(m.id) || saved >= m.threshold}
          />
        ))}
      </div>
    </div>
  );
}

function RewardRow({
  milestone,
  done,
}: {
  milestone: MilestoneDef;
  done: boolean;
}) {
  return (
    <div className={`reward-row ${done ? 'done' : ''}`}>
      <span className="reward-mark">{done ? '✓' : '○'}</span>
      <div className="reward-info">
        <div className="reward-title">
          {milestone.title}{' '}
          <span className="muted">· {formatMoney(milestone.threshold)}</span>
        </div>
        <div className="reward-blurb muted">{milestone.blurb}</div>
      </div>
    </div>
  );
}
