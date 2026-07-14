/**
 * Pip-Boy dialogue box — dark terminal panel with green glow (Fallout-style).
 */
export function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  name: string,
  text: string,
  maxWidth = 176,
) {
  const padX = 8;
  const padY = 6;
  const lineH = 11;
  const headerH = 12;
  const font = '9px "Courier New", monospace';
  const nameFont = 'bold 9px "Courier New", monospace';
  const green = '#18ff62';
  const greenBright = '#52ff8b';
  const bg = '#041207';

  ctx.font = font;
  const lines = wrapText(ctx, text, maxWidth - padX * 2);
  ctx.font = nameFont;
  const header = `> ${name.toUpperCase()}`;
  const textW = Math.max(
    ...lines.map((l) => {
      ctx.font = font;
      return ctx.measureText(l).width;
    }),
    (() => {
      ctx.font = nameFont;
      return ctx.measureText(header).width;
    })(),
  );

  const boxW = Math.min(maxWidth, Math.ceil(textW + padX * 2));
  const boxH = padY * 2 + headerH + 3 + lines.length * lineH + 2;
  let boxX = Math.round(anchorX - boxW / 2);
  const boxY = Math.round(anchorY - boxH - 12);

  // keep on-screen-ish horizontally relative to anchor
  // (camera already centers NPC)

  // outer glow
  ctx.save();
  ctx.shadowColor = 'rgba(24, 255, 98, 0.55)';
  ctx.shadowBlur = 8;

  // body
  ctx.fillStyle = bg;
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(boxX, boxY, boxW, boxH);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // CRT scanlines
  ctx.fillStyle = 'rgba(24, 255, 98, 0.04)';
  for (let y = boxY + 3; y < boxY + boxH - 2; y += 3) {
    ctx.fillRect(boxX + 2, y, boxW - 4, 1);
  }

  // inner border
  ctx.strokeStyle = 'rgba(24, 255, 98, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX + 2, boxY + 2, boxW - 4, boxH - 4);

  // tail (sharp Pip-Boy style)
  const tipX = anchorX;
  const tipY = boxY + boxH;
  ctx.fillStyle = bg;
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tipX - 5, tipY);
  ctx.lineTo(tipX, tipY + 7);
  ctx.lineTo(tipX + 5, tipY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = bg;
  ctx.fillRect(tipX - 6, tipY - 2, 12, 3);

  // header bar
  ctx.fillStyle = 'rgba(24, 255, 98, 0.12)';
  ctx.fillRect(boxX + 2, boxY + 2, boxW - 4, headerH + 2);

  ctx.fillStyle = greenBright;
  ctx.font = nameFont;
  ctx.shadowColor = green;
  ctx.shadowBlur = 4;
  ctx.fillText(header, boxX + padX, boxY + padY + 8);
  ctx.shadowBlur = 0;

  // dialogue lines
  ctx.fillStyle = green;
  ctx.font = font;
  let ty = boxY + padY + headerH + 4 + 8;
  for (const line of lines) {
    ctx.fillText(line, boxX + padX, ty);
    ty += lineH;
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}
