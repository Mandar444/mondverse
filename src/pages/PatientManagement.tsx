import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  FileText,
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  stressLevel: number;
  lastSession: string;
  status: 'stable' | 'monitoring' | 'critical' | 'in-session';
  avatar: string;
  riskLevel: 'low' | 'medium' | 'high';
  conditions: string[];
}

const PatientManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const patients: Patient[] = [
    { id: 'p-1', name: 'Sarah Johnson', age: 28, phone: '+1 (555) 100-0001', email: 'sarah.j@email.com', stressLevel: 35, lastSession: '2 hours ago', status: 'stable', avatar: '👩', riskLevel: 'low', conditions: ['Anxiety', 'Insomnia'] },
    { id: 'p-2', name: 'Mike Chen', age: 34, phone: '+1 (555) 100-0002', email: 'mike.c@email.com', stressLevel: 72, lastSession: '1 day ago', status: 'monitoring', avatar: '👨', riskLevel: 'medium', conditions: ['Depression'] },
    { id: 'p-3', name: 'Emily Davis', age: 45, phone: '+1 (555) 123-4567', email: 'emily.d@email.com', stressLevel: 88, lastSession: '3 hours ago', status: 'critical', avatar: '👩‍🦰', riskLevel: 'high', conditions: ['Severe Anxiety'] },
    { id: 'p-4', name: 'James Wilson', age: 52, phone: '+1 (555) 100-0004', email: 'james.w@email.com', stressLevel: 45, lastSession: '5 hours ago', status: 'stable', avatar: '👴', riskLevel: 'low', conditions: ['Mild Depression'] },
    { id: 'p-5', name: 'Lisa Anderson', age: 31, phone: '+1 (555) 100-0005', email: 'lisa.a@email.com', stressLevel: 65, lastSession: '1 day ago', status: 'monitoring', avatar: '👱‍♀️', riskLevel: 'medium', conditions: ['Anxiety'] },
  ];

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Patient Management</h1>
            <p className="text-muted-foreground">Manage and monitor your patients</p>
          </div>
          <Button className="gap-2">
            <Users className="w-4 h-4" />
            Add New Patient
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="stable">Stable</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="critical">Critical</option>
                  <option value="in-session">In Session</option>
                </select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-foreground">{patients.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-500">
                    {patients.filter(p => p.status === 'critical').length}
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
                  <p className="text-sm text-muted-foreground">Monitoring</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {patients.filter(p => p.status === 'monitoring').length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stable</p>
                  <p className="text-2xl font-bold text-green-500">
                    {patients.filter(p => p.status === 'stable').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>All Patients ({filteredPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(`/psychiatrist/patient/${patient.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{patient.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{patient.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{patient.age} years old</span>
                          <span>•</span>
                          <span>{patient.email}</span>
                          <span>•</span>
                          <span>Last session: {patient.lastSession}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {patient.conditions.map((condition, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-muted rounded text-xs">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">Risk:</span>
                          <span className={`text-sm font-semibold ${getRiskColor(patient.riskLevel)}`}>
                            {patient.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">Stress:</span>
                          <span className="text-sm font-semibold">{patient.stressLevel}%</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/psychiatrist/messages?patient=${patient.id}`);
                            }}
                          >
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/psychiatrist/notes/${patient.id}`);
                            }}
                          >
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientManagement;