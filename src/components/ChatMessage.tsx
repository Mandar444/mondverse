import { cn } from '@/lib/utils';
import AnimatedBot from './AnimatedBot';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
  mood?: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking';
}

const ChatMessage = ({ message, isBot, timestamp, mood = 'neutral' }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        'flex gap-3 fade-in-up',
        isBot ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      {isBot ? (
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          <AnimatedBot size="sm" mood={mood} className="w-10 h-10" />
        </div>
      ) : (
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-3 shadow-soft',
          isBot
            ? 'bg-card border border-border rounded-tl-md'
            : 'primary-gradient text-primary-foreground rounded-tr-md'
        )}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <span
            className={cn(
              'text-xs mt-1 block',
              isBot ? 'text-muted-foreground' : 'text-primary-foreground/70'
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
