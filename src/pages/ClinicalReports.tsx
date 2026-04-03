import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Download,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  BarChart3,
  Plus,
  Filter,
  Search,
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  date: string;
  type: 'summary' | 'analysis' | 'notes' | 'assessment' | 'outcome';
  category: string;
  patients: number;
  size: string;
  status: 'completed' | 'pending' | 'scheduled';
}

const ClinicalReports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const reports: Report[] = [
    {
      id: '1',
      title: 'Weekly Patient Summary',
      date: 'Jan 15, 2026',
      type: 'summary',
      category: 'Weekly Report',
      patients: 24,
      size: '2.4 MB',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Treatment Outcomes Report',
      date: 'Jan 10, 2026',
      type: 'outcome',
      category: 'Quarterly Analysis',
      patients: 45,
      size: '3.8 MB',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Session Notes Compilation',
      date: 'Jan 1, 2026',
      type: 'notes',
      category: 'Monthly Summary',
      patients: 24,
      size: '1.2 MB',
      status: 'completed',
    },
    {
      id: '4',
      title: 'Risk Assessment Summary',
      date: 'Dec 28, 2025',
      type: 'assessment',
      category: 'Risk Analysis',
      patients: 12,
      size: '890 KB',
      status: 'completed',
    },
    {
      id: '5',
      title: 'Patient Progress Analytics',
      date: 'Dec 20, 2025',
      type: 'analysis',
      category: 'Progress Report',
      patients: 24,
      size: '4.2 MB',
      status: 'completed',
    },
    {
      id: '6',
      title: 'Monthly Statistical Overview',
      date: 'Jan 20, 2026',
      type: 'analysis',
      category: 'Scheduled Report',
      patients: 24,
      size: 'N/A',
      status: 'scheduled',
    },
  ];

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'summary': return Users;
      case 'analysis': return TrendingUp;
      case 'notes': return FileText;
      case 'assessment': return Activity;
      case 'outcome': return BarChart3;
      default: return FileText;
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case 'summary': return 'bg-blue-500';
      case 'analysis': return 'bg-purple-500';
      case 'notes': return 'bg-green-500';
      case 'assessment': return 'bg-orange-500';
      case 'outcome': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownload = (report: Report) => {
    console.log('Downloading report:', report.title);
    alert(`Downloading ${report.title}...\n\nFile size: ${report.size}\nFormat: PDF`);
  };

  const handleGenerateReport = () => {
    navigate('/psychiatrist/reports/generate');
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesType;
  });

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
              Clinical Reports
            </h1>
            <p className="text-muted-foreground">
              View and download clinical reports and analytics
            </p>
          </div>
          <Button className="gap-2" onClick={handleGenerateReport}>
            <Plus className="w-4 h-4" />
            Generate New Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{reports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {reports.filter(r => r.date.includes('Jan')).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-500">
                    {reports.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {reports.filter(r => r.status === 'scheduled').length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="summary">Summary</option>
                  <option value="analysis">Analysis</option>
                  <option value="notes">Notes</option>
                  <option value="assessment">Assessment</option>
                  <option value="outcome">Outcome</option>
                </select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const Icon = getReportIcon(report.type);
            return (
              <Card
                key={report.id}
                className="cursor-pointer hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${getReportColor(report.type)} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{report.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Patients:</span>
                    <span className="font-medium">{report.patients}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">File Size:</span>
                    <span className="font-medium">{report.size}</span>
                  </div>
                  {report.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mt-2"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="w-3 h-3" />
                      Download PDF
                    </Button>
                  )}
                  {report.status === 'scheduled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mt-2"
                      disabled
                    >
                      <Calendar className="w-3 h-3" />
                      Scheduled
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports found</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Generate common reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 justify-start">
                <div className="text-left">
                  <div className="font-semibold mb-1">Patient Summary</div>
                  <div className="text-xs text-muted-foreground">
                    Generate current patient status report
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start">
                <div className="text-left">
                  <div className="font-semibold mb-1">Progress Analytics</div>
                  <div className="text-xs text-muted-foreground">
                    View treatment progress trends
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start">
                <div className="text-left">
                  <div className="font-semibold mb-1">Session Notes</div>
                  <div className="text-xs text-muted-foreground">
                    Export all session documentation
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClinicalReports;