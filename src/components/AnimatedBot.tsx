import { cn } from '@/lib/utils';
import NeuralPulse from './NeuralPulse';

interface AnimatedBotProps {
  mood?: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isSpeaking?: boolean;
}

/**
 * Global Aura Harmonic Transition: 
 * Replaced legacy character bot with high-fidelity Neural Resonance.
 */
const AnimatedBot = ({ 
  size = 'lg', 
  className,
}: AnimatedBotProps) => {
  const sizeMap = {
    sm: 'md',
    md: 'md',
    lg: 'lg',
    xl: 'xl'
  } as const;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="absolute inset-0 bg-teal-500/10 blur-[60px] rounded-full animate-pulse" />
      <NeuralPulse size={sizeMap[size]} />
    </div>
  );
};

export default AnimatedBot;
