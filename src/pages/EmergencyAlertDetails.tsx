import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Phone,
  AlertTriangle,
  User,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Activity,
  FileText,
} from 'lucide-react';

const EmergencyAlertDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  // Mock alert data - in production, fetch based on id
  const alertData = {
    id,
    patientId: 'p-3',
    patientName: 'Emily Davis',
    avatar: '👩‍🦰',
    age: 45,
    phone: '+1 (555) 123-4567',
    email: 'emily.d@email.com',
    severity: 'critical' as const,
    type: 'crisis' as const,
    message: 'Patient reported severe anxiety attack. Immediate attention required.',
    timestamp: '10 minutes ago',
    fullTimestamp: 'January 17, 2026 at 2:30 PM',
    location: 'Home (Jaipur, Rajasthan)',
    stressLevel: 88,
    riskLevel: 'high' as const,
    conditions: ['Severe Anxiety', 'Panic Disorder'],
    emergencyContact: {
      name: 'David Davis',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4568',
    },
    recentActivity: [
      { time: '2:30 PM', action: 'Emergency alert triggered', type: 'alert' },
      { time: '2:25 PM', action: 'Sent urgent message via chat', type: 'message' },
      { time: '2:20 PM', action: 'Stress level increased to 88%', type: 'stress' },
      { time: '2:15 PM', action: 'Completed panic attack assessment', type: 'assessment' },
    ],
    lastSession: 'Yesterday at 3:00 PM',
    nextScheduled: 'Tomorrow at 10:00 AM',
  };

  const handleCallPatient = () => {
    window.location.href = `tel:${alertData.phone}`;
  };

  const handleCallEmergencyContact = () => {
    if (confirm(`Call emergency contact: ${alertData.emergencyContact.name}?`)) {
      window.location.href = `tel:${alertData.emergencyContact.phone}`;
    }
  };

  const handleAcknowledge = () => {
    if (confirm('Mark this alert as acknowledged?')) {
      console.log('Alert acknowledged:', id);
      window.alert('Alert acknowledged and logged in patient record.');
      navigate('/psychiatrist');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'message': return MessageCircle;
      case 'stress': return Activity;
      case 'assessment': return FileText;
      default: return Clock;
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Alert Details - Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert Header */}
            <Card className="border-red-500 border-2">
              <CardHeader className="bg-red-50 dark:bg-red-950/20">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-red-500 text-2xl">
                        Critical Emergency Alert
                      </CardTitle>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getSeverityColor(alertData.severity)}`}>
                        {alertData.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alertData.timestamp}
                      </div>
                      <span>•</span>
                      <span>{alertData.fullTimestamp}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Alert Message</h4>
                    <p className="text-muted-foreground">{alertData.message}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Alert Type</h4>
                      <p className="text-sm text-muted-foreground capitalize">{alertData.type}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Location</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {alertData.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{alertData.avatar}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">{alertData.patientName}</h2>
                    <p className="text-muted-foreground">{alertData.age} years old</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{alertData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Risk:</span>
                        <span className="text-sm font-semibold text-red-500">
                          {alertData.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Stress:</span>
                        <span className="text-sm font-semibold">{alertData.stressLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                    <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Conditions</h4>
                    <div className="flex gap-2">
                      {alertData.conditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg text-sm"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-border">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Last Session</h4>
                      <p className="text-sm text-muted-foreground">{alertData.lastSession}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Next Scheduled</h4>
                      <p className="text-sm text-muted-foreground">{alertData.nextScheduled}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertData.recentActivity.map((activity, idx) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            {/* Immediate Actions */}
            <Card className="border-red-500/50">
              <CardHeader>
                <CardTitle className="text-red-500">Immediate Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full gap-2 bg-red-500 hover:bg-red-600"
                  onClick={handleCallPatient}
                >
                  <Phone className="w-4 h-4" />
                  Call Patient Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  onClick={handleCallEmergencyContact}
                >
                  <Phone className="w-4 h-4" />
                  Call Emergency Contact
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate(`/psychiatrist/messages?patient=${alertData.patientId}`)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{alertData.emergencyContact.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Relationship:</span>
                    <p className="font-medium">{alertData.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{alertData.emergencyContact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Patient Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate(`/psychiatrist/patient/${alertData.patientId}`)}
                >
                  <User className="w-3 h-3" />
                  View Full Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate(`/psychiatrist/notes/${alertData.patientId}`)}
                >
                  <FileText className="w-3 h-3" />
                  Add Clinical Note
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/psychiatrist/schedule?new=true')}
                >
                  <Calendar className="w-3 h-3" />
                  Schedule Follow-up
                </Button>
              </CardContent>
            </Card>

            {/* Acknowledge Alert */}
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-500/50">
              <CardContent className="p-4">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handleAcknowledge}
                >
                  Acknowledge Alert
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  This will mark the alert as handled and log the action
                </p>
              </CardContent>
            </Card>

            {/* Crisis Resources */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-500/50">
              <CardHeader>
                <CardTitle className="text-sm">Crisis Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <p><strong>National Crisis Line:</strong> 988</p>
                  <p><strong>Emergency Services:</strong> 911</p>
                  <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmergencyAlertDetails;