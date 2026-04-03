import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  FileText,
  Settings,
  BarChart3,
  Loader2,
  Bell,
  HelpCircle
} from 'lucide-react';
import { QuickActionType } from '@/types';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onAction: (action: QuickActionType) => void;
  unreadMessages?: number;
  pendingAppointments?: number;
}

const QuickActions = ({ 
  onAction, 
  unreadMessages = 0,
  pendingAppointments = 0 
}: QuickActionsProps) => {
  const [loadingAction, setLoadingAction] = useState<QuickActionType | null>(null);

  const actions = [
    { 
      type: 'messages' as QuickActionType, 
      label: 'Messages', 
      icon: MessageCircle, 
      color: 'primary',
      badge: unreadMessages,
      description: 'View patient messages'
    },
    { 
      type: 'appointments' as QuickActionType, 
      label: 'Appointments', 
      icon: Calendar, 
      color: 'highlight',
      badge: pendingAppointments,
      description: 'Manage schedule'
    },
    { 
      type: 'patients' as QuickActionType, 
      label: 'Patients', 
      icon: Users, 
      color: 'success',
      description: 'View all patients'
    },
    { 
      type: 'notes' as QuickActionType, 
      label: 'Clinical Notes', 
      icon: FileText, 
      color: 'accent',
      description: 'Access notes'
    },
    { 
      type: 'reports' as QuickActionType, 
      label: 'Reports', 
      icon: BarChart3, 
      color: 'warning',
      description: 'View analytics'
    },
    { 
      type: 'settings' as QuickActionType, 
      label: 'Settings', 
      icon: Settings, 
      color: 'muted',
      description: 'Preferences'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary/10 text-primary hover:bg-primary/20',
      highlight: 'bg-highlight/10 text-highlight-foreground hover:bg-highlight/20',
      success: 'bg-success/10 text-success hover:bg-success/20',
      accent: 'bg-accent/10 text-accent-foreground hover:bg-accent/20',
      warning: 'bg-warning/10 text-warning hover:bg-warning/20',
      muted: 'bg-muted text-muted-foreground hover:bg-muted/80',
    };
    return colors[color] || colors.primary;
  };

  const handleAction = async (action: QuickActionType) => {
    console.log('Quick action clicked:', action);
    setLoadingAction(action);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const messages: Record<QuickActionType, string> = {
      messages: '📬 Opening messages...\n\nLoading patient conversations.',
      appointments: '📅 Viewing appointments...\n\nOpening calendar view.',
      patients: '👥 Viewing patient list...\n\nLoading all patients.',
      notes: '📝 Opening notes...\n\nAccessing clinical documentation.',
      settings: '⚙️ Opening settings...\n\nLoading preferences.',
      reports: '📊 Opening reports...\n\nLoading analytics dashboard.',
    };
    
    alert(messages[action]);
    setLoadingAction(null);
    onAction(action);
  };

  return (
    <Card variant="glass" className="fade-in-up">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {actions.map((action, index) => (
            <Button
              key={action.type}
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-2 h-auto py-4 relative transition-all duration-300 fade-in-up",
                getColorClasses(action.color)
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleAction(action.type)}
              disabled={loadingAction !== null}
            >
              {action.badge && action.badge > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {action.badge > 9 ? '9+' : action.badge}
                </span>
              )}
              {loadingAction === action.type ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <action.icon className="w-5 h-5" />
              )}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
