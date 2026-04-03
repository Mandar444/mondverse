import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Moon,
  LogOut,
  Trash2,
  HelpCircle,
  FileText,
  ChevronRight,
  Calendar,
  Users,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';

const PsychiatristSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      navigate('/');
    }
  };

  const settingsOptions = [
    {
      icon: User,
      title: 'Professional Profile',
      description: 'Manage your credentials and professional information',
      action: () => navigate('/psychiatrist/profile'),
      color: 'bg-primary',
    },
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Configure patient intake and case load settings',
      action: () => navigate('/psychiatrist/patient-settings'),
      color: 'bg-blue-500',
    },
    {
      icon: Calendar,
      title: 'Schedule & Availability',
      description: 'Set your working hours and appointment preferences',
      action: () => navigate('/psychiatrist/schedule-settings'),
      color: 'bg-purple-500',
    },
    {
      icon: Bell,
      title: 'Notifications & Alerts',
      description: 'Configure emergency alerts and notification preferences',
      action: () => navigate('/psychiatrist/notifications'),
      color: 'bg-orange-500',
    },
    {
      icon: Stethoscope,
      title: 'Clinical Tools',
      description: 'Manage assessment tools and treatment templates',
      action: () => navigate('/psychiatrist/clinical-tools'),
      color: 'bg-green-500',
    },
    {
      icon: ClipboardList,
      title: 'Documentation Settings',
      description: 'Configure note templates and documentation preferences',
      action: () => navigate('/psychiatrist/documentation'),
      color: 'bg-cyan-500',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'HIPAA compliance and data security settings',
      action: () => navigate('/psychiatrist/privacy'),
      color: 'bg-red-500',
    },
    {
      icon: Moon,
      title: 'Appearance',
      description: 'Customize theme and dashboard layout',
      action: () => navigate('/psychiatrist/appearance'),
      color: 'bg-indigo-500',
    },
    {
      icon: FileText,
      title: 'Terms & Policies',
      description: 'Professional guidelines and compliance',
      action: () => navigate('/psychiatrist/terms'),
      color: 'bg-teal-500',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact technical support',
      action: () => navigate('/psychiatrist/help'),
      color: 'bg-pink-500',
    },
  ];

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

        <section className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Professional Settings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your professional profile and practice settings
          </p>
        </section>

        <section className="max-w-5xl mx-auto mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {settingsOptions.map((option, index) => (
              <Card
                key={option.title}
                className="cursor-pointer hover:shadow-lg transition-all"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={option.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center shadow-lg shrink-0`}
                      >
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto">
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Account Actions</CardTitle>
              <CardDescription>
                Manage your account and session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Log Out</h3>
                  <p className="text-sm text-muted-foreground">
                    End your current session
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="mt-8 max-w-5xl mx-auto bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">HIPAA Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  All settings and data handling comply with HIPAA regulations. Your patient information is encrypted and securely stored. Any changes to critical settings will be logged for compliance purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PsychiatristSettings;