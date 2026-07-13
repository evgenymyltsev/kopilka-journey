import { useEffect, useMemo, useRef } from 'react';
import { CELL_PX } from '../../utils/constants';
import {
  createRng,
  generatePath,
  generateWanderers,
  getCellSprites,
  samplePath,
} from '../../utils/mapGenerator';
import {
  npcIdleFrame,
  placeMilestones,
  rewardSpriteKind,
  type MapMilestone,
} from '../../utils/rewards';
import {
  drawSprite,
  loadSpriteSheets,
  playerFrame,
  SPRITES,
  type SheetMap,
} from '../../utils/sprites';
import { MiniMap } from './MiniMap';

interface GameCanvasProps {
  saved: number;
  goalAmount: number;
  totalCells: number;
  currentCell: number;
  mapSeed: number;
  claimedMilestones: string[];
}

export function GameCanvas({
  saved,
  goalAmount,
  totalCells,
  currentCell,
  mapSeed,
  claimedMilestones,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetsRef = useRef<SheetMap | null>(null);
  const path = useMemo(
    () => generatePath(totalCells, mapSeed),
    [totalCells, mapSeed],
  );
  const cellDecor = useMemo(() => {
    const rng = createRng(mapSeed ^ 0x9e3779b9);
    return Array.from({ length: totalCells }, (_, i) =>
      getCellSprites(i, totalCells, rng),
    );
  }, [totalCells, mapSeed]);

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
    [mapSeed, totalCells, milestones],
  );

  const claimedSet = useMemo(
    () => new Set(claimedMilestones),
    [claimedMilestones],
  );

  const animRef = useRef({
    progress: goalAmount > 0 ? saved / goalAmount : 0,
    walkFrame: 1,
    walkTimer: 0,
    camX: 0,
    camY: 0,
    bob: 0,
  });

  useEffect(() => {
    let cancelled = false;
    loadSpriteSheets()
      .then((sheets) => {
        if (!cancelled) sheetsRef.current = sheets;
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let lastTs = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const targetProgress =
      goalAmount > 0 ? Math.min(1, saved / goalAmount) : 0;

    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      const anim = animRef.current;

      anim.progress += (targetProgress - anim.progress) * Math.min(1, dt * 7);
      anim.bob += dt;

      if (Math.abs(targetProgress - anim.progress) > 0.002) {
        anim.walkTimer += dt;
        if (anim.walkTimer > 0.12) {
          anim.walkTimer = 0;
          anim.walkFrame = (anim.walkFrame + 1) % 3;
        }
      } else {
        anim.walkFrame = 1;
        anim.progress = targetProgress;
      }

      const parent = canvas.parentElement!;
      draw(ctx, parent.clientWidth, parent.clientHeight);
      raf = requestAnimationFrame(tick);
    };

    const drawMilestone = (
      c: CanvasRenderingContext2D,
      sheets: SheetMap,
      m: MapMilestone,
      x: number,
      y: number,
      claimed: boolean,
    ) => {
      const kind = rewardSpriteKind(m.def.rewardKind, claimed);
      const sprite = SPRITES[kind];
      const bob = claimed ? 0 : Math.sin(animRef.current.bob * 3) * 3;
      drawSprite(
        c,
        sheets,
        sprite,
        x + 6,
        y - CELL_PX * 0.55 + bob,
        CELL_PX * 0.85,
        CELL_PX * 0.85,
        claimed ? 1 : 0.95,
      );
      drawSprite(
        c,
        sheets,
        npcIdleFrame(m.def.npcIndex),
        x + CELL_PX * 0.55,
        y - CELL_PX * 0.45,
        CELL_PX * 0.7,
        CELL_PX * 0.95,
      );

      c.fillStyle = claimed ? '#3fb950' : '#e3b341';
      c.font = '9px monospace';
      c.fillText(`${m.def.threshold}`, x + 2, y + CELL_PX + 10);
    };

    const draw = (c: CanvasRenderingContext2D, w: number, h: number) => {
      const sheets = sheetsRef.current;
      const anim = animRef.current;
      const player = samplePath(path, anim.progress);

      const targetCamX = player.x - w * 0.4;
      const targetCamY = player.y - h * 0.45;
      anim.camX += (targetCamX - anim.camX) * 0.12;
      anim.camY += (targetCamY - anim.camY) * 0.12;

      c.clearRect(0, 0, w, h);
      c.fillStyle = '#0d1117';
      c.fillRect(0, 0, w, h);

      c.strokeStyle = 'rgba(63, 185, 80, 0.25)';
      c.lineWidth = 6;
      c.lineJoin = 'round';
      c.beginPath();
      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        const sx = p.x - anim.camX + CELL_PX / 2;
        const sy = p.y - anim.camY + CELL_PX / 2;
        if (i === 0) c.moveTo(sx, sy);
        else c.lineTo(sx, sy);
      }
      c.stroke();

      const milestoneByCell = new Map(
        milestones.map((m) => [m.cellIndex, m] as const),
      );

      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        const x = p.x - anim.camX;
        const y = p.y - anim.camY;
        if (
          x < -CELL_PX * 2 ||
          x > w + CELL_PX ||
          y < -CELL_PX * 2 ||
          y > h + CELL_PX
        ) {
          continue;
        }

        const { ground, prop } = cellDecor[i] ?? getCellSprites(i, totalCells);
        const passed = i <= currentCell;
        const alpha = passed ? 1 : 0.4;
        const milestone = milestoneByCell.get(i);

        if (sheets) {
          drawSprite(c, sheets, ground, x, y, CELL_PX, CELL_PX, alpha);
          // обычный декор пропускаем на клетках с наградой
          if (prop && !milestone) {
            const propH = prop.h > 16 ? CELL_PX * 1.4 : CELL_PX * 0.9;
            const propY = y - (propH - CELL_PX * 0.55);
            drawSprite(
              c,
              sheets,
              prop,
              x + 4,
              propY,
              CELL_PX * 0.85,
              propH,
              alpha,
            );
          }
          if (milestone) {
            const claimed =
              claimedSet.has(milestone.def.id) || saved >= milestone.def.threshold;
            drawMilestone(c, sheets, milestone, x, y, claimed);
          }
        } else {
          c.fillStyle = passed ? '#3fb950' : '#30363d';
          c.fillRect(x + 4, y + 4, CELL_PX - 8, CELL_PX - 8);
        }
      }

      // странствующие NPC
      if (sheets) {
        for (const npc of wanderers) {
          const p = path[npc.cellIndex];
          if (!p) continue;
          const x = p.x - anim.camX + npc.offsetX;
          const y = p.y - anim.camY + npc.offsetY;
          if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue;
          const visible = npc.cellIndex <= currentCell ? 1 : 0.5;
          const bob = Math.sin(anim.bob * 2 + npc.cellIndex) * 2;
          drawSprite(
            c,
            sheets,
            npcIdleFrame(npc.npcIndex),
            x + 10,
            y - CELL_PX * 0.4 + bob,
            CELL_PX * 0.65,
            CELL_PX * 0.9,
            visible,
          );
        }
      }

      const px = player.x - anim.camX;
      const py = player.y - anim.camY - CELL_PX * 0.35;
      if (sheets) {
        drawSprite(
          c,
          sheets,
          playerFrame(anim.walkFrame),
          px + 8,
          py,
          CELL_PX * 0.7,
          CELL_PX * 1.1,
        );
      } else {
        c.fillStyle = '#58a6ff';
        c.fillRect(px + 12, py, 24, 32);
      }

      c.fillStyle = '#e6edf3';
      c.font = '12px monospace';
      c.fillText(`${Math.round(saved)} / ${goalAmount}₽`, 10, 20);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [
    saved,
    goalAmount,
    totalCells,
    currentCell,
    path,
    cellDecor,
    milestones,
    wanderers,
    claimedSet,
  ]);

  return (
    <div className="game-canvas-wrap">
      <canvas ref={canvasRef} />
      <MiniMap
        saved={saved}
        goalAmount={goalAmount}
        totalCells={totalCells}
        currentCell={currentCell}
        mapSeed={mapSeed}
        claimedMilestones={claimedMilestones}
      />
    </div>
  );
}
