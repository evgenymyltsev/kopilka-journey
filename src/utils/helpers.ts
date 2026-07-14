export function formatMoney(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')}₽`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function daysSince(startedAt: number | null): number {
  if (!startedAt) return 1;
  const ms = Date.now() - startedAt;
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function buildShareMessage(
  goalName: string,
  goalAmount: number,
  days: number,
): string {
  return `☢ Quest complete: "${goalName}"! Saved ${formatMoney(goalAmount)} in ${days} day${days === 1 ? '' : 's'} on the wasteland road. War never changes — thrift can.`;
}
