import { motion } from 'framer-motion'

function SkeletonBar({ width = '100%', height = '12px', className = '' }) {
  return (
    <div className={`rounded-md bg-white/[0.04] overflow-hidden ${className}`} style={{ width, height }}>
      <motion.div
        className="h-full w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-white/[0.04]" />
        <SkeletonBar width="120px" height="14px" />
      </div>
      <SkeletonBar width="80%" height="10px" />
      <SkeletonBar width="60%" height="10px" />
      <div className="flex gap-2 pt-1">
        <SkeletonBar width="60px" height="18px" className="rounded-full" />
        <SkeletonBar width="60px" height="18px" className="rounded-full" />
      </div>
    </div>
  )
}

export default function PageSkeleton({ lines = 3, cards = 3 }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 p-2 sm:p-3">
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBar width="200px" height="24px" />
        <SkeletonBar width="100px" height="16px" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBar key={i} width={`${70 + Math.random() * 30}%`} height="10px" />
        ))}
      </div>
    </motion.div>
  )
}

export { SkeletonBar, SkeletonCard }
