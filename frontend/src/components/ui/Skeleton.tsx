import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type SkeletonVariant = 'text' | 'card' | 'chart' | 'circle';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  card: 'h-48 w-full rounded-xl',
  chart: 'h-64 w-full rounded-xl',
  circle: 'h-10 w-10 rounded-full',
};

export function Skeleton({ variant = 'text', className }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse bg-slate-200', variantStyles[variant]),
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-xl border border-slate-200 p-6',
        className
      )}
    >
      <div className="mb-4 h-4 w-3/4 rounded bg-slate-200" />
      <div className="mb-2 h-3 w-full rounded bg-slate-200" />
      <div className="mb-2 h-3 w-5/6 rounded bg-slate-200" />
      <div className="mb-4 h-3 w-4/6 rounded bg-slate-200" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={twMerge('flex items-center gap-4 py-3', className)}>
      <div className="h-4 w-8 rounded bg-slate-200" />
      <div className="h-4 flex-1 rounded bg-slate-200" />
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="h-4 w-20 rounded bg-slate-200" />
      <div className="h-4 w-16 rounded bg-slate-200" />
    </div>
  );
}
