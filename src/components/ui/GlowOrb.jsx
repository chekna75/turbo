export default function GlowOrb({ className = '', slow = false }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${
        slow ? 'animate-orb-float-slow' : 'animate-orb-float'
      } ${className}`}
    />
  )
}
