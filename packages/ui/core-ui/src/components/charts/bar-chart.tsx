'use client';

import * as React from 'react';
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getChartColor } from './palette';
import type { ChartBaseProps } from './types';
import { ChartTooltip } from '../ui/chart-tooltip';

interface BarChartProps extends ChartBaseProps {
  layout?: 'horizontal' | 'vertical';
}

export function BarChart({
  data,
  series,
  xAxisKey,
  height = 280,
  layout = 'horizontal',
  className,
}: BarChartProps) {
  const isVertical = layout === 'vertical';
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} layout={layout}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          {isVertical ? (
            <>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey={xAxisKey} tick={{ fontSize: 10 }} width={90} />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
            </>
          )}
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s, i) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              fill={s.color ?? getChartColor(i)}
              radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
