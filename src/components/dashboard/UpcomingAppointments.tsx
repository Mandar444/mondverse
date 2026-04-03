import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  User, 
  Phone, 
  Clock, 
  Play,
  Calendar,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Appointment } from '@/types';
import { cn } from '@/lib/utils';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onJoinCall: (appointment: Appointment) => void;
  onStartSession: (appointment: Appointment) => void;
  onViewAll: () => void;
}

const UpcomingAppointments = ({ 
  appointments, 
  onJoinCall, 
  onStartSession,
  onViewAll 
}: UpcomingAppointmentsProps) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [sessionStates, setSessionStates] = useState<Record<string, 'idle' | 'joining' | 'active'>>({});
  const [countdown, setCountdown] = useState<string>('');

  // Countdown timer for next appointment
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextAppointment = appointments.find(a => a.status === 'scheduled');
      
      if (nextAppointment) {
        // Parse time like "09:00 AM" and create date for today
        const [time, period] = nextAppointment.time.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const appointmentDate = new Date();
        appointmentDate.setHours(
          period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours,
          minutes,
          0
        );
        
        const diff = appointmentDate.getTime() - now.getTime();
        
        if (diff > 0) {
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        } else {
          setCountdown('Now');
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [appointments]);

  const getTypeIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'in-person':
        return <User className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: Appointment['type']) => {
    switch (type) {
      case 'video':
        return 'Video Call';
      case 'in-person':
        return 'In Person';
      case 'phone':
        return 'Phone Call';
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'in-progress':
        return 'bg-success/20 text-success border-success/30';
      case 'completed':
        return 'bg-muted text-muted-foreground border-muted';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive border-destructive/30';
    }
  };

  const handleJoinCall = async (appointment: Appointment) => {
    console.log('Joining call for:', appointment.patientName);
    setLoadingStates(prev => ({ ...prev, [appointment.id]: true }));
    setSessionStates(prev => ({ ...prev, [appointment.id]: 'joining' }));
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoadingStates(prev => ({ ...prev, [appointment.id]: false }));
    setSessionStates(prev => ({ ...prev, [appointment.id]: 'active' }));
    
    alert(`📹 Joining video call with ${appointment.patientName}...\n\nConnecting to secure video session...\nSession ID: ${appointment.id}\n\n✅ Connected successfully!`);
    onJoinCall(appointment);
  };

  const handleStartSession = async (appointment: Appointment) => {
    console.log('Starting session for:', appointment.patientName);
    setLoadingStates(prev => ({ ...prev, [appointment.id]: true }));
    setSessionStates(prev => ({ ...prev, [appointment.id]: 'joining' }));
    
    // Simulate preparation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setLoadingStates(prev => ({ ...prev, [appointment.id]: false }));
    setSessionStates(prev => ({ ...prev, [appointment.id]: 'active' }));
    
    alert(`🏥 Starting in-person session with ${appointment.patientName}...\n\nRoom: Consultation Room A\nDuration: ${appointment.duration} minutes\n\n✅ Session started!`);
    onStartSession(appointment);
  };

  const handleViewAll = () => {
    console.log('Viewing all appointments');
    alert('📅 Opening appointments calendar...\n\nNavigating to full schedule view.');
    onViewAll();
  };

  const todayAppointments = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled');

  return (
    <Card variant="glass" className="fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Appointments
            </CardTitle>
            <CardDescription>
              {todayAppointments.length} appointments scheduled
            </CardDescription>
          </div>
          {countdown && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Next appointment in</p>
              <p className="text-lg font-mono font-bold text-primary">{countdown}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todayAppointments.slice(0, 5).map((appointment, index) => (
            <div
              key={appointment.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-300 fade-in-up",
                sessionStates[appointment.id] === 'active' 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-muted/50 border-border hover:bg-muted'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{appointment.avatar}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{appointment.patientName}</p>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getTypeIcon(appointment.type)}
                      {getTypeLabel(appointment.type)}
                    </Badge>
                    <Badge className={getStatusColor(appointment.status)}>
                      {sessionStates[appointment.id] === 'active' ? 'In Session' : appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {appointment.time} • {appointment.duration} min
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {appointment.type === 'video' ? (
                  <Button 
                    size="sm"
                    onClick={() => handleJoinCall(appointment)}
                    disabled={loadingStates[appointment.id] || sessionStates[appointment.id] === 'active'}
                    className={cn(
                      "flex items-center gap-2",
                      sessionStates[appointment.id] === 'active' && 'bg-success hover:bg-success/90'
                    )}
                  >
                    {loadingStates[appointment.id] ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : sessionStates[appointment.id] === 'active' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        In Call
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        Join Call
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    variant={appointment.type === 'phone' ? 'outline' : 'default'}
                    onClick={() => handleStartSession(appointment)}
                    disabled={loadingStates[appointment.id] || sessionStates[appointment.id] === 'active'}
                    className={cn(
                      "flex items-center gap-2",
                      sessionStates[appointment.id] === 'active' && 'bg-success hover:bg-success/90 text-white'
                    )}
                  >
                    {loadingStates[appointment.id] ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Starting...
                      </>
                    ) : sessionStates[appointment.id] === 'active' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Session
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {appointments.length > 5 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={handleViewAll}
          >
            View All {appointments.length} Appointments
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
