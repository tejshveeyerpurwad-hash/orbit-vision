export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse">
      <div className="h-3 w-24 skeleton rounded mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 skeleton rounded mb-2 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg p-3 animate-pulse">
      <div className="h-2 w-2 rounded-full skeleton" />
      <div className="flex-1 h-3 skeleton rounded" />
      <div className="h-3 w-16 skeleton rounded" />
    </div>
  )
}

export function SkeletonBlock() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonCard lines={6} />
        <SkeletonCard lines={6} />
      </div>
    </div>
  )
}
