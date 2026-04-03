import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Download,
  Trash2,
} from 'lucide-react';

interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  profileVisibility: boolean;
  shareProgress: boolean;
}

const Privacy = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PrivacySettings>({
    dataCollection: true,
    analytics: true,
    profileVisibility: false,
    shareProgress: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('privacySettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key: keyof PrivacySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('privacySettings', JSON.stringify(newSettings));
  };

  const handleExportData = () => {
    const userData = {
      profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
      settings: settings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindcare-data-${Date.now()}.json`;
    link.click();
  };

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('privacySettings');
      localStorage.removeItem('notificationSettings');
      alert('All your data has been deleted.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const privacyOptions = [
    {
      key: 'dataCollection' as const,
      icon: Database,
      title: 'Data Collection',
      description: 'Allow MindCare to collect usage data to improve the app',
    },
    {
      key: 'analytics' as const,
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Help us understand how you use MindCare',
    },
    {
      key: 'profileVisibility' as const,
      icon: Eye,
      title: 'Profile Visibility',
      description: 'Make your profile visible to healthcare providers',
    },
    {
      key: 'shareProgress' as const,
      icon: Share2,
      title: 'Share Progress',
      description: 'Share anonymous progress data to help research',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/settings')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Button>

        <section className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Privacy & Security
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Control your privacy settings and data
          </p>
        </section>

        <section className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control what data is collected and how it's used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyOptions.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <option.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(option.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[option.key] ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[option.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or delete your personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Export Your Data
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of all your personal information
                    </p>
                  </div>
                </div>
                <Button onClick={handleExportData} variant="outline">
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-500 mb-1">
                      Delete All Data
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently remove all your data from MindCare
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleDeleteData}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>
                Keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      End-to-end encryption enabled
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your conversations with Dr. Mind are encrypted and private.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      HIPAA Compliant
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    MindCare follows healthcare privacy regulations to protect your data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Your Privacy Matters</h3>
                  <p className="text-sm text-muted-foreground">
                    We take your privacy seriously. Your mental health data is never sold to third parties. 
                    You have full control over your information and can export or delete it at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

// Add missing imports at the top
import { TrendingUp, Share2 } from 'lucide-react';

export default Privacy;