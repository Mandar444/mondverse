import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  Calendar,
  MessageCircle,
  UserPlus,
  FileText,
  CheckCircle,
  X,
  Filter,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'emergency' | 'appointment' | 'message' | 'system' | 'patient';
  title: string;
  message: string;
  time: string;
  read: boolean;
  patientId?: string;
  patientName?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

const NotificationsCenter = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'emergency',
      title: 'Critical Alert',
      message: 'Emily Davis reported severe anxiety attack. Immediate attention required.',
      time: '10 minutes ago',
      read: false,
      patientId: 'p-3',
      patientName: 'Emily Davis',
      priority: 'critical',
    },
    {
      id: '2',
      type: 'emergency',
      title: 'Self-Harm Risk Detected',
      message: 'Marcus Thompson - Self-harm indicators detected in recent chat messages.',
      time: '25 minutes ago',
      read: false,
      patientId: 'p-7',
      patientName: 'Marcus Thompson',
      priority: 'critical',
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Upcoming Session',
      message: 'Session with Sarah Johnson starts in 30 minutes (Video Call)',
      time: '15 minutes ago',
      read: false,
      patientId: 'p-1',
      patientName: 'Sarah Johnson',
      priority: 'high',
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      message: 'Mike Chen: "The new techniques are helping with my sleep!"',
      time: '1 hour ago',
      read: false,
      patientId: 'p-2',
      patientName: 'Mike Chen',
      priority: 'normal',
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Session Completed',
      message: 'Session with Lisa Anderson has been marked as completed.',
      time: '2 hours ago',
      read: true,
      patientId: 'p-5',
      patientName: 'Lisa Anderson',
      priority: 'low',
    },
    {
      id: '6',
      type: 'patient',
      title: 'Missed Sessions',
      message: 'Jessica Miller has missed 3 consecutive therapy sessions.',
      time: '3 hours ago',
      read: false,
      patientId: 'p-12',
      patientName: 'Jessica Miller',
      priority: 'high',
    },
    {
      id: '7',
      type: 'system',
      title: 'Weekly Report Ready',
      message: 'Your weekly patient summary report is now available for download.',
      time: '5 hours ago',
      read: true,
      priority: 'low',
    },
    {
      id: '8',
      type: 'message',
      title: 'Urgent Message',
      message: 'Amanda Wilson: "I\'ve been struggling with negative thoughts again..."',
      time: '6 hours ago',
      read: false,
      patientId: 'p-8',
      patientName: 'Amanda Wilson',
      priority: 'high',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'appointment': return Calendar;
      case 'message': return MessageCircle;
      case 'patient': return UserPlus;
      case 'system': return FileText;
      default: return Bell;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'normal': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'low': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Navigate based on type
    if (notification.type === 'emergency') {
      navigate(`/psychiatrist/alert/${notification.id}`);
    } else if (notification.type === 'message' && notification.patientId) {
      navigate(`/psychiatrist/messages?patient=${notification.patientId}`);
    } else if (notification.type === 'appointment' && notification.patientId) {
      navigate(`/psychiatrist/patient/${notification.patientId}`);
    } else if (notification.type === 'patient' && notification.patientId) {
      navigate(`/psychiatrist/patient/${notification.patientId}`);
    } else if (notification.type === 'system') {
      navigate('/psychiatrist/reports');
    }
  };

  const handleMarkAsRead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDismiss = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
              Notifications
            </h1>
            <p className="text-muted-foreground">
              Stay updated with important alerts and messages
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'emergency' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('emergency')}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Emergency
              </Button>
              <Button
                variant={filter === 'appointment' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('appointment')}
              >
                <Calendar className="w-3 h-3 mr-1" />
                Appointments
              </Button>
              <Button
                variant={filter === 'message' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('message')}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Messages
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="max-w-4xl space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications to display</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    !notification.read ? 'border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getNotificationColor(
                          notification.priority
                        )}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDismiss(notification.id, e)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{notification.time}</span>
                          {notification.patientName && (
                            <>
                              <span>•</span>
                              <span>{notification.patientName}</span>
                            </>
                          )}
                          {notification.priority === 'critical' && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded">
                                CRITICAL
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
                </div>
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-blue-500">{unreadCount}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Emergency</p>
                  <p className="text-2xl font-bold text-red-500">
                    {notifications.filter(n => n.type === 'emergency').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-green-500">
                    {notifications.filter(n => n.time.includes('ago')).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NotificationsCenter;