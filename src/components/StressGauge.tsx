import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface StressGaugeProps {
  level: number; // 0-100
  className?: string;
}

const StressGauge = ({ level, className }: StressGaugeProps) => {
  // Normalize level to 0-100 for SVG calculations
  const normalizedLevel = Math.min(Math.max(level, 0), 100);
  
  // Calculate needle rotation (from -90deg to 90deg)
  const rotation = useMemo(() => {
    return (normalizedLevel / 100) * 180 - 90;
  }, [normalizedLevel]);

  const getColorClass = () => {
    if (normalizedLevel <= 30) return 'text-success';
    if (normalizedLevel <= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getGlowColor = () => {
    if (normalizedLevel <= 30) return 'rgba(29, 158, 117, 0.4)';
    if (normalizedLevel <= 60) return 'rgba(186, 117, 23, 0.4)';
    return 'rgba(226, 75, 74, 0.4)';
  };

  return (
    <div className={cn('relative flex flex-col items-center w-full max-w-[280px] mx-auto', className)}>
      <svg viewBox="0 0 100 55" className="w-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D9E75" />
            <stop offset="50%" stopColor="#BA7517" />
            <stop offset="100%" stopColor="#E24B4A" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#edf2f7"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Level Track */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="125.6"
          strokeDashoffset={125.6 - (normalizedLevel / 100) * 125.6}
          className="transition-all duration-1000 ease-out"
        />

        {/* Needle */}
        <g 
            transform={`rotate(${rotation}, 50, 50)`} 
            className="transition-transform duration-1000 ease-out"
        >
          <line
            x1="50" y1="50" x2="50" y2="15"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
            filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.2))"
          />
          <circle cx="50" cy="50" r="4" fill="#1a1a2e" />
          <circle 
            cx="50" cy="15" r="3" 
            fill="white" 
            stroke={normalizedLevel <= 30 ? '#1D9E75' : normalizedLevel <= 60 ? '#BA7517' : '#E24B4A'}
            strokeWidth="1.5"
            style={{ filter: 'url(#glow)', fill: getGlowColor() }}
          />
        </g>
      </svg>

      <div className="absolute bottom-0 text-center">
        <span className={cn("text-3xl font-black tracking-tighter transition-colors duration-500", getColorClass())}>
          {normalizedLevel}%
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground -mt-1 opacity-60">
            Stress Intensity
        </p>
      </div>
    </div>
  );
};

export default StressGauge;

