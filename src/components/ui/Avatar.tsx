import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/formatters'

interface AvatarProps {
  name: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

const colorSeeds: Record<string, string> = {
  A: 'bg-red-100 text-red-700',
  B: 'bg-orange-100 text-orange-700',
  C: 'bg-amber-100 text-amber-700',
  D: 'bg-yellow-100 text-yellow-700',
  E: 'bg-lime-100 text-lime-700',
  F: 'bg-green-100 text-green-700',
  G: 'bg-emerald-100 text-emerald-700',
  H: 'bg-teal-100 text-teal-700',
  I: 'bg-cyan-100 text-cyan-700',
  J: 'bg-sky-100 text-sky-700',
  K: 'bg-blue-100 text-blue-700',
  L: 'bg-indigo-100 text-indigo-700',
  M: 'bg-violet-100 text-violet-700',
  N: 'bg-purple-100 text-purple-700',
  O: 'bg-fuchsia-100 text-fuchsia-700',
  P: 'bg-pink-100 text-pink-700',
  Q: 'bg-rose-100 text-rose-700',
  R: 'bg-red-100 text-red-700',
  S: 'bg-orange-100 text-orange-700',
  T: 'bg-blue-100 text-blue-700',
  U: 'bg-green-100 text-green-700',
  V: 'bg-purple-100 text-purple-700',
  W: 'bg-indigo-100 text-indigo-700',
  X: 'bg-teal-100 text-teal-700',
  Y: 'bg-yellow-100 text-yellow-700',
  Z: 'bg-cyan-100 text-cyan-700',
}

function getColorClass(name: string): string {
  const first = name[0]?.toUpperCase() || 'A'
  return colorSeeds[first] || 'bg-gray-100 text-gray-700'
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover flex-shrink-0', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0',
        sizeClasses[size],
        getColorClass(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
