import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  avatar: string;
  type: 'video' | 'in-person' | 'phone';
  time: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

const PsychiatristSchedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const appointments: Appointment[] = [
    { id: 'apt-1', patientId: 'p-1', patientName: 'Sarah Johnson', avatar: '👩', type: 'video', time: '09:00 AM', duration: 60, status: 'scheduled' },
    { id: 'apt-2', patientId: 'p-2', patientName: 'Mike Chen', avatar: '👨', type: 'in-person', time: '10:30 AM', duration: 45, status: 'scheduled' },
    { id: 'apt-3', patientId: 'p-4', patientName: 'James Wilson', avatar: '👴', type: 'video', time: '11:30 AM', duration: 60, status: 'scheduled' },
    { id: 'apt-4', patientId: 'p-5', patientName: 'Lisa Anderson', avatar: '👱‍♀️', type: 'phone', time: '01:00 PM', duration: 30, status: 'scheduled' },
    { id: 'apt-5', patientId: 'p-6', patientName: 'Robert Brown', avatar: '👨‍🦱', type: 'video', time: '02:00 PM', duration: 60, status: 'scheduled' },
    { id: 'apt-6', patientId: 'p-9', patientName: 'Jennifer Lee', avatar: '👩‍🦳', type: 'in-person', time: '03:30 PM', duration: 45, status: 'scheduled' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <Users className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500';
      case 'phone':
        return 'bg-green-500';
      case 'in-person':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/psychiatrist')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              Schedule
            </h1>
            <p className="text-muted-foreground">
              Manage your appointments and availability
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={view === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
                className="rounded-none"
              >
                Day
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className="rounded-none border-l border-border"
              >
                Week
              </Button>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-muted-foreground font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 3;
                  const isToday = day === 17;
                  return (
                    <button
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                        isToday
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : day > 0 && day <= 31
                          ? 'hover:bg-muted text-foreground'
                          : 'text-muted-foreground/40'
                      }`}
                    >
                      {day > 0 && day <= 31 ? day : ''}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">Video Call</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-muted-foreground">In-Person</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Phone</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>
                {appointments.length} appointments scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <Card
                    key={apt.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => navigate(`/psychiatrist/patient/${apt.patientId}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{apt.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {apt.patientName}
                            </h3>
                            <div
                              className={`w-6 h-6 rounded-full ${getTypeColor(
                                apt.type
                              )} flex items-center justify-center text-white`}
                            >
                              {getTypeIcon(apt.type)}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {apt.time}
                            </div>
                            <span>•</span>
                            <span>{apt.duration} minutes</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {apt.type === 'video' && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/psychiatrist/session/${apt.id}`);
                              }}
                            >
                              Join Call
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/psychiatrist/notes/${apt.patientId}`);
                            }}
                          >
                            View Notes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Today</div>
              <div className="text-2xl font-bold text-foreground">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">This Week</div>
              <div className="text-2xl font-bold text-foreground">28</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-500">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Upcoming</div>
              <div className="text-2xl font-bold text-blue-500">16</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PsychiatristSchedule;