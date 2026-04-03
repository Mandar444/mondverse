import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  Calendar,
  TrendingUp,
  Mail,
} from 'lucide-react';

interface NotificationSettings {
  reminders: boolean;
  checkIns: boolean;
  progress: boolean;
  messages: boolean;
  email: boolean;
  sound: boolean;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>({
    reminders: true,
    checkIns: true,
    progress: false,
    messages: true,
    email: false,
    sound: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const notificationOptions = [
    {
      key: 'reminders' as const,
      icon: Bell,
      title: 'Reminders',
      description: 'Get notified about your scheduled activities and exercises',
    },
    {
      key: 'checkIns' as const,
      icon: Calendar,
      title: 'Daily Check-ins',
      description: 'Receive prompts to log your mood and mental state',
    },
    {
      key: 'progress' as const,
      icon: TrendingUp,
      title: 'Progress Updates',
      description: 'Weekly summaries of your mental health journey',
    },
    {
      key: 'messages' as const,
      icon: MessageCircle,
      title: 'Chat Messages',
      description: 'Notifications when Dr. Mind has a message for you',
    },
    {
      key: 'email' as const,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive important updates via email',
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
              <Bell className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Notifications
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage how and when you receive notifications
          </p>
        </section>

        <section className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationOptions.map((option) => (
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
              <CardTitle>Sound & Vibration</CardTitle>
              <CardDescription>
                Control notification sounds and vibrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Notification Sounds
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Play a sound when receiving notifications
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('sound')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.sound ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.sound ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Notification Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Enable reminders to stay on track with your wellness routine</li>
                    <li>• Daily check-ins help track your mood patterns over time</li>
                    <li>• You can change these settings anytime</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Notifications;