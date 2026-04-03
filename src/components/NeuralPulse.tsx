import { cn } from '@/lib/utils';

const NeuralPulse = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  return (
    <div className={cn(sizeClasses[size], "relative flex items-center justify-center")}>
      {/* Central Core */}
      <div className="absolute w-1/4 h-1/4 bg-white rounded-full shadow-[0_0_50px_rgba(45,212,191,0.8)] z-10 animate-pulse" />
      
      {/* Outer Rings */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute inset-0 border border-teal-400/30 rounded-full animate-ping"
          style={{ 
            animationDuration: `${2 + i}s`, 
            animationDelay: `${i * 0.5}s`,
            opacity: 1 - i * 0.2
          }}
        />
      ))}
      
      {/* Orbiting Particles */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-indigo-400 rounded-full blur-[2px] animate-float-harmonic"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + i * 2}s`
          }}
        />
      ))}

      {/* Internal Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-full blur-3xl animate-breathe" />
    </div>
  );
};

export default NeuralPulse;
