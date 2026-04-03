import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  Activity,
} from 'lucide-react';

const PatientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  // Mock patient data - in production, fetch based on id
  const patient = {
    id,
    name: 'Sarah Johnson',
    age: 28,
    avatar: '👩',
    phone: '+1 (555) 100-0001',
    email: 'sarah.j@email.com',
    stressLevel: 35,
    riskLevel: 'low' as const,
    status: 'stable' as const,
    conditions: ['Anxiety', 'Insomnia'],
    medications: ['Sertraline 50mg daily', 'Melatonin 3mg at bedtime'],
    allergies: ['Penicillin'],
    emergencyContact: {
      name: 'John Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 100-0002',
    },
    lastSession: '2 hours ago',
    nextSession: 'Tomorrow at 10:00 AM',
    sessionCount: 12,
    notes: 'Making good progress with anxiety management. Patient is responding well to CBT techniques.',
  };

  const recentSessions = [
    { date: 'Jan 15, 2026', type: 'Video Call', duration: '60 min', notes: 'Good progress with breathing exercises' },
    { date: 'Jan 10, 2026', type: 'In-Person', duration: '45 min', notes: 'Discussed work-related stress triggers' },
    { date: 'Jan 5, 2026', type: 'Phone Call', duration: '30 min', notes: 'Check-in session, patient doing well' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'monitoring': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'stable': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'in-session': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
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
          {/* Patient Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="text-center">
                <div className="text-6xl mb-4">{patient.avatar}</div>
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <p className="text-muted-foreground">{patient.age} years old</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full gap-2" 
                onClick={() => navigate(`/psychiatrist/messages?patient=${id}`)}
              >
                <MessageCircle className="w-4 h-4" />
                Send Message
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2" 
                onClick={() => navigate(`/psychiatrist/notes/${id}`)}
              >
                <FileText className="w-4 h-4" />
                Add Clinical Note
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2" 
                onClick={() => navigate('/psychiatrist/schedule?new=true')}
              >
                <Calendar className="w-4 h-4" />
                Schedule Session
              </Button>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <span className={`text-sm font-semibold ${getRiskColor(patient.riskLevel)}`}>
                    {patient.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stress Level</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${patient.stressLevel}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{patient.stressLevel}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <span className="text-sm font-semibold">{patient.sessionCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <h4 className="font-semibold mb-2">Emergency Contact</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Name: </span>
                      {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Phone: </span>
                      {patient.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Conditions
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {patient.conditions.map((condition, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Current Medications</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {patient.medications.map((medication, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {medication}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Allergies
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {patient.allergies.map((allergy, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg text-sm"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Last {recentSessions.length} therapy sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session, idx) => (
                    <Card key={idx} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{session.date}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{session.duration}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm px-2 py-0.5 bg-background rounded">
                            {session.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clinical Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Clinical Notes</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/psychiatrist/notes/${id}`)}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Latest Note</span>
                  </div>
                  <p className="text-sm">{patient.notes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Session */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Next Session</h4>
                    <p className="text-sm text-muted-foreground">{patient.nextSession}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDetails;