/** Draw a pixel-ish speech bubble above an NPC */
export function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  name: string,
  text: string,
  maxWidth = 160,
) {
  const padX = 8;
  const padY = 6;
  const lineH = 12;
  const nameH = 11;
  const font = '10px monospace';
  const nameFont = 'bold 9px monospace';

  ctx.font = font;
  const lines = wrapText(ctx, text, maxWidth - padX * 2);
  const textW = Math.max(
    ...lines.map((l) => ctx.measureText(l).width),
    ctx.measureText(name).width,
  );
  const boxW = Math.min(maxWidth, Math.ceil(textW + padX * 2));
  const boxH = padY * 2 + nameH + 4 + lines.length * lineH;
  const boxX = Math.round(anchorX - boxW / 2);
  const boxY = Math.round(anchorY - boxH - 10);

  // bubble body
  ctx.fillStyle = '#e6edf3';
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 2;
  roundRect(ctx, boxX, boxY, boxW, boxH, 6);
  ctx.fill();
  ctx.stroke();

  // tail
  const tipX = anchorX;
  const tipY = boxY + boxH;
  ctx.beginPath();
  ctx.moveTo(tipX - 6, tipY);
  ctx.lineTo(tipX, tipY + 8);
  ctx.lineTo(tipX + 6, tipY);
  ctx.closePath();
  ctx.fillStyle = '#e6edf3';
  ctx.fill();
  ctx.stroke();
  // cover top of tail stroke
  ctx.fillStyle = '#e6edf3';
  ctx.fillRect(tipX - 7, tipY - 2, 14, 4);

  // name
  ctx.fillStyle = '#0969da';
  ctx.font = nameFont;
  ctx.fillText(name, boxX + padX, boxY + padY + 8);

  // lines
  ctx.fillStyle = '#0a0c10';
  ctx.font = font;
  let ty = boxY + padY + nameH + 4 + 9;
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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
