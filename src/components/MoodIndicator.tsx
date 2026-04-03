import { cn } from '@/lib/utils';

interface MoodIndicatorProps {
  mood: 'great' | 'good' | 'okay' | 'low' | 'stressed';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const moodConfig = {
  great: {
    emoji: '😊',
    label: 'Great',
    color: 'bg-success/20 border-success/30 text-success',
    gradient: 'from-success/20 to-success/5',
  },
  good: {
    emoji: '🙂',
    label: 'Good',
    color: 'bg-highlight/20 border-highlight/30 text-highlight-foreground',
    gradient: 'from-highlight/20 to-highlight/5',
  },
  okay: {
    emoji: '😐',
    label: 'Okay',
    color: 'bg-warning/20 border-warning/30 text-warning-foreground',
    gradient: 'from-warning/20 to-warning/5',
  },
  low: {
    emoji: '😔',
    label: 'Low',
    color: 'bg-accent/20 border-accent/30 text-accent-foreground',
    gradient: 'from-accent/20 to-accent/5',
  },
  stressed: {
    emoji: '😟',
    label: 'Stressed',
    color: 'bg-destructive/20 border-destructive/30 text-destructive',
    gradient: 'from-destructive/20 to-destructive/5',
  },
};

const sizeClasses = {
  sm: 'text-xl p-2',
  md: 'text-3xl p-3',
  lg: 'text-5xl p-4',
};

const MoodIndicator = ({ mood, size = 'md', showLabel = true, className }: MoodIndicatorProps) => {
  const config = moodConfig[mood];

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-2xl border-2 transition-all duration-300 hover:scale-110',
          config.color,
          sizeClasses[size]
        )}
      >
        <span role="img" aria-label={config.label}>
          {config.emoji}
        </span>
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', config.color.split(' ')[2])}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default MoodIndicator;
