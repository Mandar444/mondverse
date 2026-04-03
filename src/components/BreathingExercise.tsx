import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreathingExerciseProps {
  className?: string;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const phaseConfig = {
  inhale: { duration: 4, label: 'Breathe In', color: 'text-primary' },
  hold: { duration: 4, label: 'Hold', color: 'text-highlight' },
  exhale: { duration: 6, label: 'Breathe Out', color: 'text-accent' },
  rest: { duration: 2, label: 'Rest', color: 'text-muted-foreground' },
};

const BreathingExercise = ({ className }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [countdown, setCountdown] = useState(phaseConfig.inhale.duration);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const phases: Phase[] = ['inhale', 'hold', 'exhale', 'rest'];
          const currentIndex = phases.indexOf(phase);
          const nextPhase = phases[(currentIndex + 1) % phases.length];
          
          if (nextPhase === 'inhale') {
            setCycles((c) => c + 1);
          }
          
          setPhase(nextPhase);
          return phaseConfig[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(phaseConfig.inhale.duration);
    setCycles(0);
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'exhale') return 'scale-75';
    return 'scale-100';
  };

  return (
    <Card variant="glass" className={cn('max-w-md mx-auto', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Breathing Exercise</CardTitle>
        <p className="text-sm text-muted-foreground">4-4-6-2 Pattern</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Breathing Circle */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer glow */}
          <div
            className={cn(
              'absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-1000',
              isActive && getCircleScale()
            )}
          />
          
          {/* Main circle */}
          <div
            className={cn(
              'w-32 h-32 rounded-full primary-gradient flex items-center justify-center transition-all duration-1000 shadow-glow',
              isActive && getCircleScale()
            )}
          >
            <div className="text-center text-primary-foreground">
              <div className="text-4xl font-bold">{countdown}</div>
              <div className={cn('text-sm font-medium', phaseConfig[phase].color)}>
                {phaseConfig[phase].label}
              </div>
            </div>
          </div>
          
          {/* Decorative rings */}
          <div
            className={cn(
              'absolute inset-0 rounded-full border-2 border-primary/30 transition-all duration-1000',
              isActive && getCircleScale()
            )}
          />
          <div
            className={cn(
              'absolute inset-4 rounded-full border border-primary/20 transition-all duration-1000',
              isActive && getCircleScale()
            )}
          />
        </div>

        {/* Cycles counter */}
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Cycles completed: </span>
          <span className="font-semibold text-primary">{cycles}</span>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            variant={isActive ? 'outline' : 'default'}
            size="lg"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </Button>
          <Button variant="ghost" size="lg" onClick={handleReset}>
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-center text-muted-foreground max-w-xs">
          Follow the circle's rhythm. This pattern helps activate your parasympathetic nervous system.
        </p>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
