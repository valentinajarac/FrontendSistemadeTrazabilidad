import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface LineChartProps {
  data: any[];
  xAxisKey: string;
  lines: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number;
}

export function LineChart({ data, xAxisKey, lines, height = 400 }: LineChartProps) {
  // Ordenar los datos por fecha
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a[xAxisKey]);
    const dateB = new Date(b[xAxisKey]);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsLineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={(value) => {
              if (typeof value === 'string') {
                const date = parseISO(value);
                return format(date, 'MMM yyyy', { locale: es });
              }
              return value;
            }}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => {
              if (typeof value === 'string') {
                const date = parseISO(value);
                return format(date, 'MMMM yyyy', { locale: es });
              }
              return value;
            }}
            formatter={(value: number) => [`${value.toFixed(2)} kg`, '']}
          />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
