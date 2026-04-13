export const CHART_COLOR_COUNT = 8;

export function getChartColor(index: number): string {
  const slot = (index % CHART_COLOR_COUNT) + 1;
  return `hsl(var(--chart-${slot}))`;
}

export function getChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getChartColor(i));
}
