'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeConfig = {
  sm: { stroke: 6, radius: 32, viewBox: 72, fontSize: 'text-lg', containerSize: 'w-[72px] h-[72px]' },
  md: { stroke: 8, radius: 44, viewBox: 100, fontSize: 'text-2xl', containerSize: 'w-[100px] h-[100px]' },
  lg: { stroke: 10, radius: 56, viewBox: 128, fontSize: 'text-3xl', containerSize: 'w-[128px] h-[128px]' },
};

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: '#22c55e', text: 'text-green-600', bg: 'text-green-100' };
  if (score >= 60) return { stroke: '#eab308', text: 'text-yellow-600', bg: 'text-yellow-100' };
  if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'text-amber-100' };
  return { stroke: '#ef4444', text: 'text-red-600', bg: 'text-red-100' };
}

export function ScoreRing({ score, size = 'md', showLabel = true }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const color = getScoreColor(score);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(score / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={clsx('relative', config.containerSize)}>
        <svg
          width={config.viewBox}
          height={config.viewBox}
          viewBox={`0 0 ${config.viewBox} ${config.viewBox}`}
          className="transform -rotate-90"
        >
          <circle
            cx={config.viewBox / 2}
            cy={config.viewBox / 2}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className={color.bg}
          />
          <circle
            cx={config.viewBox / 2}
            cy={config.viewBox / 2}
            r={config.radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={clsx('font-bold', color.text, config.fontSize)}>
            {animatedScore}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-600">Score</span>
      )}
    </div>
  );
}
