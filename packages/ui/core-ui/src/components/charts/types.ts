export interface ChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface ChartBaseProps<TDatum = Record<string, unknown>> {
  data: TDatum[];
  series: ChartSeries[];
  xAxisKey: string;
  height?: number;
  className?: string;
}
