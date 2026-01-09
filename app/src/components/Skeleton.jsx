// Composants Skeleton pour les états de chargement

export function Skeleton({ className = '', animate = true }) {
  return (
    <div
      className={`bg-[var(--color-bg-tertiary)] rounded-lg ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="w-24 h-8" />
      </div>
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="w-72 bg-[var(--color-bg)] border-r border-[var(--color-border)] flex flex-col h-screen">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <Skeleton className="h-4 w-16 mb-4" />
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 flex-1" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
      </div>

      {/* Phase dropdown */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      {/* Steps */}
      <div className="flex-1 p-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[var(--color-border)] space-y-2">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonStepContent() {
  return (
    <div className="max-w-4xl mx-auto p-8 animate-pulse">
      {/* Header */}
      <div className="rounded-2xl p-6 mb-8 bg-[var(--color-bg-tertiary)]">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* Fields */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-bg)] rounded-xl p-5 border border-[var(--color-border)]">
              <Skeleton className="h-4 w-40 mb-3" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-[var(--color-border)] last:border-b-0">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
