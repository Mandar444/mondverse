import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { DashboardStats } from '@/types';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: DashboardStats;
  onStatClick: (statType: string) => void;
}

const StatsCards = ({ stats, onStatClick }: StatsCardsProps) => {
  const [animatedStats, setAnimatedStats] = useState<DashboardStats>({
    activePatients: 0,
    todayAppointments: 0,
    pendingMessages: 0,
    criticalAlerts: 0,
    completedSessions: 0,
    averageStress: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        activePatients: Math.round(stats.activePatients * easeOut),
        todayAppointments: Math.round(stats.todayAppointments * easeOut),
        pendingMessages: Math.round(stats.pendingMessages * easeOut),
        criticalAlerts: Math.round(stats.criticalAlerts * easeOut),
        completedSessions: Math.round(stats.completedSessions * easeOut),
        averageStress: Math.round(stats.averageStress * easeOut),
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats(stats);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [stats]);

  const statConfigs = [
    { 
      key: 'activePatients',
      label: 'Active Patients', 
      value: animatedStats.activePatients, 
      icon: Users, 
      color: 'primary',
      description: 'Currently under care'
    },
    { 
      key: 'todayAppointments',
      label: "Today's Appointments", 
      value: animatedStats.todayAppointments, 
      icon: Calendar, 
      color: 'highlight',
      description: 'Scheduled for today'
    },
    { 
      key: 'pendingMessages',
      label: 'Pending Messages', 
      value: animatedStats.pendingMessages, 
      icon: MessageCircle, 
      color: 'warning',
      description: 'Awaiting response'
    },
    { 
      key: 'criticalAlerts',
      label: 'Critical Alerts', 
      value: animatedStats.criticalAlerts, 
      icon: AlertTriangle, 
      color: 'destructive',
      description: 'Require attention'
    },
    { 
      key: 'completedSessions',
      label: 'Sessions This Week', 
      value: animatedStats.completedSessions, 
      icon: TrendingUp, 
      color: 'success',
      description: 'Completed sessions'
    },
    { 
      key: 'averageStress',
      label: 'Avg. Stress Level', 
      value: `${animatedStats.averageStress}%`, 
      icon: Activity, 
      color: animatedStats.averageStress > 60 ? 'warning' : 'success',
      description: 'Across all patients'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
      primary: { 
        bg: 'bg-primary/10', 
        text: 'text-primary',
        hover: 'hover:bg-primary/20 hover:border-primary/30'
      },
      highlight: { 
        bg: 'bg-highlight/10', 
        text: 'text-highlight-foreground',
        hover: 'hover:bg-highlight/20 hover:border-highlight/30'
      },
      warning: { 
        bg: 'bg-warning/10', 
        text: 'text-warning',
        hover: 'hover:bg-warning/20 hover:border-warning/30'
      },
      destructive: { 
        bg: 'bg-destructive/10', 
        text: 'text-destructive',
        hover: 'hover:bg-destructive/20 hover:border-destructive/30'
      },
      success: { 
        bg: 'bg-success/10', 
        text: 'text-success',
        hover: 'hover:bg-success/20 hover:border-success/30'
      },
    };
    return colors[color] || colors.primary;
  };

  const handleClick = (statKey: string, label: string) => {
    console.log('Stat clicked:', statKey);
    alert(`📊 ${label} Details\n\nOpening detailed view for ${label}...`);
    onStatClick(statKey);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statConfigs.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        
        return (
          <Card
            key={stat.key}
            variant="elevated"
            className={cn(
              "cursor-pointer transition-all duration-300 fade-in-up border",
              colors.hover
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleClick(stat.key, stat.label)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  colors.bg
                )}>
                  <stat.icon className={cn("w-5 h-5", colors.text)} />
                </div>
                {stat.color === 'destructive' && Number(stat.value) > 0 && (
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <p className={cn("text-2xl font-bold", colors.text)}>
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
