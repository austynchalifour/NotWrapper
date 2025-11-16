type VerdictBadgeProps = {
  verdict: 'NotWrapper' | 'Wrapper Sus' | 'Wrapper Confirmed'
  confidence: number
  size?: 'sm' | 'md' | 'lg'
}

export default function VerdictBadge({ verdict, confidence, size = 'md' }: VerdictBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const badgeClass = 
    verdict === 'NotWrapper' ? 'badge-notwrapper' :
    verdict === 'Wrapper Sus' ? 'badge-wrapper-sus' :
    'badge-wrapper-confirmed'

  return (
    <div className={`${badgeClass} ${sizeClasses[size]}`}>
      <span className="font-bold">{verdict}</span>
      <span className="ml-2 opacity-75">{confidence}%</span>
    </div>
  )
}

