import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Check,
  CheckCheck,
  Loader2,
  Send,
  Clock
} from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface RecentMessagesProps {
  messages: Message[];
  onMarkAsRead: (messageId: string) => void;
  onReply: (message: Message) => void;
  onViewAll: () => void;
}

const RecentMessages = ({ 
  messages, 
  onMarkAsRead, 
  onReply,
  onViewAll 
}: RecentMessagesProps) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, string>>({});
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'normal':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleMarkAsRead = async (message: Message) => {
    console.log('Marking as read:', message.id);
    setLoadingStates(prev => ({ ...prev, [message.id]: 'read' }));
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setReadMessages(prev => new Set([...prev, message.id]));
    setLoadingStates(prev => ({ ...prev, [message.id]: '' }));
    
    alert(`✅ Message from ${message.patientName} marked as read`);
    onMarkAsRead(message.id);
  };

  const handleReply = async (message: Message) => {
    console.log('Opening reply for:', message.patientName);
    setLoadingStates(prev => ({ ...prev, [message.id]: 'reply' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoadingStates(prev => ({ ...prev, [message.id]: '' }));
    
    alert(`💬 Opening reply to ${message.patientName}...\n\nMessage: "${message.content}"\n\nCompose your response...`);
    onReply(message);
  };

  const handleViewAll = () => {
    console.log('Viewing all messages');
    alert('📬 Opening all messages...\n\nLoading complete message history.');
    onViewAll();
  };

  const unreadCount = messages.filter(m => !m.read && !readMessages.has(m.id)).length;

  return (
    <Card variant="glass" className="fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Recent Messages
            </CardTitle>
            <CardDescription>
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.slice(0, 5).map((message, index) => {
            const isRead = message.read || readMessages.has(message.id);
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-xl border transition-all duration-300 fade-in-up",
                  isRead 
                    ? 'bg-muted/30 border-border' 
                    : 'bg-card border-primary/20 shadow-sm'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative">
                    <span className="text-2xl">{message.avatar}</span>
                    {!isRead && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className={cn(
                        "font-medium",
                        isRead ? 'text-muted-foreground' : 'text-foreground'
                      )}>
                        {message.patientName}
                      </p>
                      <Badge className={getPriorityColor(message.priority)}>
                        {message.priority}
                      </Badge>
                    </div>
                    <p className={cn(
                      "text-sm line-clamp-2",
                      isRead ? 'text-muted-foreground' : 'text-foreground'
                    )}>
                      {message.content}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {message.timestamp}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 self-end sm:self-center">
                  {!isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkAsRead(message)}
                      disabled={loadingStates[message.id] === 'read'}
                      title="Mark as read"
                    >
                      {loadingStates[message.id] === 'read' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button 
                    variant={isRead ? 'ghost' : 'outline'}
                    size="sm"
                    onClick={() => handleReply(message)}
                    disabled={loadingStates[message.id] === 'reply'}
                  >
                    {loadingStates[message.id] === 'reply' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {messages.length > 5 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={handleViewAll}
          >
            View All {messages.length} Messages
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMessages;
