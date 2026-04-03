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
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.clear();
      navigate('/');
    }
  };

  const settingsOptions = [
    {
      icon: User,
      title: 'Profile',
      description: 'View and edit your personal information',
      action: () => navigate('/profile'),
      color: 'bg-primary',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage your notification preferences',
      action: () => navigate('/notifications'),
      color: 'bg-blue-500',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      action: () => navigate('/privacy'),
      color: 'bg-green-500',
    },
    {
      icon: Moon,
      title: 'Appearance',
      description: 'Customize theme and display',
      action: () => navigate('/appearance'),
      color: 'bg-purple-500',
    },
    {
      icon: FileText,
      title: 'Terms & Privacy Policy',
      description: 'Read our terms and privacy policy',
      action: () => navigate('/terms-policy'),
      color: 'bg-cyan-500',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => navigate('/help-support'),
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your account, preferences, and privacy settings
          </p>
        </section>

        {/* Settings Options */}
        <section className="max-w-4xl mx-auto mb-8">
          <div className="grid gap-4">
            {settingsOptions.map((option, index) => (
              <Card
                key={option.title}
                className="cursor-pointer hover:shadow-lg transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={option.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center shadow-lg`}
                      >
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="max-w-4xl mx-auto">
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                These actions are permanent and cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Log Out</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
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

              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <div>
                  <h3 className="font-semibold text-red-500 mb-1">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* App Info */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              MindCare AI - Mental Health Support Platform
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0 | © 2024 MindCare. Your mental health matters.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;