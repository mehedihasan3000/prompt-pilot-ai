'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { ScoreTrendData } from '@/types/analytics.types';

interface ScoreOverTimeChartProps {
  data: ScoreTrendData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm font-bold text-indigo-600">Score: {item.averageScore}</p>
      <p className="text-xs text-slate-400">Prompts: {item.count}</p>
    </div>
  );
}

export function ScoreOverTimeChart({ data }: ScoreOverTimeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => {
            const d = new Date(val);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => `${val}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="averageScore"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#scoreGradient)"
          dot={{ fill: '#6366f1', r: 3 }}
          activeDot={{ fill: '#6366f1', r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
