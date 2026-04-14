'use client';

import * as React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { getChartColor } from './palette';
import { ChartTooltip } from '../ui/chart-tooltip';

export interface DonutChartDatum {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutChartDatum[];
  height?: number;
  innerRadius?: number | string;
  outerRadius?: number | string;
  showLegend?: boolean;
  className?: string;
}

export function DonutChart({
  data,
  height = 280,
  innerRadius = '45%',
  outerRadius = '70%',
  showLegend = true,
  className,
}: DonutChartProps) {
  return (
    <div className={className} style={{ width: '100%', height }}>
      <div className="flex h-full items-center gap-4">
        <div className="flex-1" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={entry.color ?? getChartColor(i)} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {showLegend ? (
          <ul className="flex flex-col gap-2 text-xs">
            {data.map((entry, i) => (
              <li key={entry.name} className="flex items-center gap-2">
                <span
                  className="inline-block size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color ?? getChartColor(i) }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
