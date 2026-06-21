export const parseFormattedNumber = (value: string) => {
  const raw = value.replace(/[^\d]/g, "");
  return raw === "" ? null : Number(raw);
};

export const formatInputNumber = (value: number | null) =>
  value == null ? "" : value.toLocaleString("en-US");

export function formatDisplayNumber(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}G`;
  }

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return value.toString();
}
