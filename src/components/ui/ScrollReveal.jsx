import { useScrollReveal } from '../../hooks/useScrollReveal'

const directions = {
  up:    { hidden: 'opacity-0 translate-y-10', visible: 'opacity-100 translate-y-0' },
  down:  { hidden: 'opacity-0 -translate-y-10', visible: 'opacity-100 translate-y-0' },
  left:  { hidden: 'opacity-0 -translate-x-10', visible: 'opacity-100 translate-x-0' },
  right: { hidden: 'opacity-0 translate-x-10', visible: 'opacity-100 translate-x-0' },
  fade:  { hidden: 'opacity-0', visible: 'opacity-100' },
}

export default function ScrollReveal({
  children,
  className = '',
  delay = '0ms',
  direction = 'up',
}) {
  const { ref, isVisible } = useScrollReveal()
  const { hidden, visible } = directions[direction] || directions.up

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? visible : hidden} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  )
}
