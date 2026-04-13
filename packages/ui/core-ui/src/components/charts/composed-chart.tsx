'use client';

import * as React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getChartColor } from './palette';
import { ChartTooltip } from '../ui/chart-tooltip';

export interface ComposedSeries {
  dataKey: string;
  name?: string;
  color?: string;
  type: 'bar' | 'line';
  yAxis?: 'left' | 'right';
}

interface ComposedChartProps {
  data: Record<string, unknown>[];
  series: ComposedSeries[];
  xAxisKey: string;
  height?: number;
  className?: string;
}

export function ComposedChart({
  data,
  series,
  xAxisKey,
  height = 300,
  className,
}: ComposedChartProps) {
  const hasRightAxis = series.some((s) => s.yAxis === 'right');
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
          {hasRightAxis ? (
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
          ) : null}
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s, i) => {
            const color = s.color ?? getChartColor(i);
            const axisId = s.yAxis ?? 'left';
            if (s.type === 'bar') {
              return (
                <Bar
                  key={s.dataKey}
                  yAxisId={axisId}
                  dataKey={s.dataKey}
                  name={s.name ?? s.dataKey}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                />
              );
            }
            return (
              <Line
                key={s.dataKey}
                yAxisId={axisId}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name ?? s.dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            );
          })}
        </RechartsComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
