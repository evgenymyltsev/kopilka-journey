import { useEffect, useMemo, useRef } from 'react';
import { CELL_PX } from '../../utils/constants';
import {
  generatePath,
  generateWanderers,
  pathBounds,
  samplePath,
} from '../../utils/mapGenerator';
import { placeMilestones } from '../../utils/rewards';

interface MiniMapProps {
  saved: number;
  goalAmount: number;
  totalCells: number;
  currentCell: number;
  mapSeed: number;
  claimedMilestones: string[];
}

const W = 132;
const H = 132;
const PAD = 8;

export function MiniMap({
  saved,
  goalAmount,
  totalCells,
  currentCell,
  mapSeed,
  claimedMilestones,
}: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const path = useMemo(
    () => generatePath(totalCells, mapSeed),
    [totalCells, mapSeed],
  );
  const milestones = useMemo(
    () => placeMilestones(goalAmount, totalCells),
    [goalAmount, totalCells],
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
  const claimed = useMemo(
    () => new Set(claimedMilestones),
    [claimedMilestones],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || path.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bounds = pathBounds(path);
    const bw = Math.max(1, bounds.maxX - bounds.minX + CELL_PX);
    const bh = Math.max(1, bounds.maxY - bounds.minY + CELL_PX);
    const scale = Math.min((W - PAD * 2) / bw, (H - PAD * 2) / bh);

    const project = (x: number, y: number) => ({
      x: PAD + (x - bounds.minX + CELL_PX / 2) * scale,
      y: PAD + (y - bounds.minY + CELL_PX / 2) * scale,
    });

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(13, 17, 23, 0.92)';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

    // path
    ctx.strokeStyle = 'rgba(63, 185, 80, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    path.forEach((p, i) => {
      const s = project(p.x, p.y);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.stroke();

    // passed trail highlight
    if (currentCell > 0) {
      ctx.strokeStyle = '#3fb950';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= Math.min(currentCell, path.length - 1); i++) {
        const s = project(path[i].x, path[i].y);
        if (i === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      }
      ctx.stroke();
    }

    // wanderers (cyan dots)
    for (const npc of wanderers) {
      const p = path[npc.cellIndex];
      if (!p) continue;
      const s = project(p.x + npc.offsetX, p.y + npc.offsetY);
      ctx.fillStyle =
        npc.cellIndex <= currentCell
          ? 'rgba(88, 166, 255, 0.95)'
          : 'rgba(88, 166, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // milestones / rewards
    for (const m of milestones) {
      const p = path[m.cellIndex];
      if (!p) continue;
      const s = project(p.x, p.y);
      const done = claimed.has(m.def.id) || saved >= m.def.threshold;
      ctx.fillStyle = done ? '#3fb950' : '#e3b341';
      ctx.strokeStyle = done ? '#238636' : '#9e6a03';
      ctx.lineWidth = 1;
      // diamond
      const r = 3.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - r);
      ctx.lineTo(s.x + r, s.y);
      ctx.lineTo(s.x, s.y + r);
      ctx.lineTo(s.x - r, s.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // finish
    const finish = path[path.length - 1];
    if (finish) {
      const s = project(finish.x, finish.y);
      ctx.fillStyle = '#f778ba';
      ctx.fillRect(s.x - 2.5, s.y - 2.5, 5, 5);
    }

    // player
    const progress = goalAmount > 0 ? Math.min(1, saved / goalAmount) : 0;
    const player = samplePath(path, progress);
    const ps = project(player.x, player.y);
    ctx.fillStyle = '#58a6ff';
    ctx.strokeStyle = '#e6edf3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ps.x, ps.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [
    path,
    milestones,
    wanderers,
    claimed,
    saved,
    goalAmount,
    currentCell,
  ]);

  return (
    <div className="minimap" aria-label="Minimap">
      <canvas ref={canvasRef} style={{ width: W, height: H }} />
      <div className="minimap-legend">
        <span>
          <i className="dot reward" /> reward
        </span>
        <span>
          <i className="dot npc" /> NPC
        </span>
        <span>
          <i className="dot you" /> you
        </span>
      </div>
    </div>
  );
}
