import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Eye,
  MoreHorizontal,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Patient } from '@/types';
import { cn } from '@/lib/utils';
import StressGauge from '@/components/StressGauge';

interface PatientListProps {
  patients: Patient[];
  onViewDetails: (patient: Patient) => void;
  onSendMessage: (patient: Patient) => void;
  onAddNote: (patient: Patient) => void;
  onUpdateStatus: (patient: Patient, newStatus: Patient['status']) => void;
}

const PatientList = ({ 
  patients, 
  onViewDetails, 
  onSendMessage, 
  onAddNote,
  onUpdateStatus 
}: PatientListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, string>>({});
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  const getStatusIcon = (status: Patient['status']) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-3 h-3" />;
      case 'stable':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'in-session':
        return <Clock className="w-3 h-3 animate-pulse" />;
      case 'monitoring':
        return <Eye className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'stable':
        return 'bg-success/20 text-success border-success/30';
      case 'in-session':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'monitoring':
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  const getRiskColor = (risk: Patient['riskLevel']) => {
    switch (risk) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.conditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = async (patient: Patient) => {
    console.log('Viewing details for:', patient.name);
    setLoadingStates(prev => ({ ...prev, [patient.id]: 'view' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoadingStates(prev => ({ ...prev, [patient.id]: '' }));
    
    alert(`📋 Patient Details: ${patient.name}\n\n` +
      `Age: ${patient.age}\n` +
      `Status: ${patient.status}\n` +
      `Stress Level: ${patient.stressLevel}%\n` +
      `Risk Level: ${patient.riskLevel}\n` +
      `Email: ${patient.email}\n` +
      `Phone: ${patient.phone}\n` +
      `Last Session: ${patient.lastSession}\n` +
      `Conditions: ${patient.conditions.join(', ')}\n` +
      `Notes: ${patient.notes}`);
    
    onViewDetails(patient);
  };

  const handleSendMessage = async (patient: Patient) => {
    console.log('Opening chat with:', patient.name);
    setLoadingStates(prev => ({ ...prev, [patient.id]: 'message' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoadingStates(prev => ({ ...prev, [patient.id]: '' }));
    
    alert(`💬 Opening chat with ${patient.name}...\n\nMessage composer opened.\nPatient will receive notification.`);
    
    onSendMessage(patient);
  };

  const handleAddNote = async (patient: Patient) => {
    console.log('Adding note for:', patient.name);
    setLoadingStates(prev => ({ ...prev, [patient.id]: 'note' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoadingStates(prev => ({ ...prev, [patient.id]: '' }));
    
    alert(`📝 Opening notes editor for ${patient.name}...\n\nNote template loaded.\nAuto-save enabled.`);
    
    onAddNote(patient);
  };

  const handleStatusChange = async (patient: Patient, newStatus: Patient['status']) => {
    console.log(`Changing status for ${patient.name} to ${newStatus}`);
    setLoadingStates(prev => ({ ...prev, [patient.id]: 'status' }));
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLoadingStates(prev => ({ ...prev, [patient.id]: '' }));
    setExpandedPatient(null);
    
    alert(`✅ Status updated!\n\n${patient.name}'s status changed to "${newStatus}"`);
    
    onUpdateStatus(patient, newStatus);
  };

  const toggleExpanded = (patientId: string) => {
    setExpandedPatient(prev => prev === patientId ? null : patientId);
  };

  return (
    <Card variant="glass" className="fade-in-up">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>
              {filteredPatients.length} of {patients.length} patients
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients or conditions..."
              value={searchQuery}
              onChange={(e) => {
                console.log('Searching for:', e.target.value);
                setSearchQuery(e.target.value);
              }}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredPatients.map((patient, index) => (
            <div
              key={patient.id}
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={cn(
                  "flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                  patient.status === 'critical' 
                    ? 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10' 
                    : 'bg-muted/50 border-border hover:bg-muted'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
                      {patient.avatar}
                    </div>
                    {patient.status === 'in-session' && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground truncate">{patient.name}</p>
                      <Badge className={cn("flex items-center gap-1", getStatusColor(patient.status))}>
                        {getStatusIcon(patient.status)}
                        {patient.status}
                      </Badge>
                      <span className={cn("text-xs font-medium", getRiskColor(patient.riskLevel))}>
                        {patient.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Age: {patient.age} • Last: {patient.lastSession}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.conditions.slice(0, 2).map((condition, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {patient.conditions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{patient.conditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-40">
                  <StressGauge level={patient.stressLevel} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleAddNote(patient)}
                    disabled={loadingStates[patient.id] === 'note'}
                    title="Add Note"
                  >
                    {loadingStates[patient.id] === 'note' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSendMessage(patient)}
                    disabled={loadingStates[patient.id] === 'message'}
                    title="Send Message"
                  >
                    {loadingStates[patient.id] === 'message' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(patient)}
                    disabled={loadingStates[patient.id] === 'view'}
                  >
                    {loadingStates[patient.id] === 'view' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(patient.id)}
                    title="More Actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Expanded Actions */}
              {expandedPatient === patient.id && (
                <div className="mt-2 p-4 rounded-xl bg-muted/30 border border-border fade-in-up">
                  <p className="text-sm font-medium mb-2">Change Status:</p>
                  <div className="flex flex-wrap gap-2">
                    {(['stable', 'monitoring', 'critical', 'in-session'] as const).map(status => (
                      <Button
                        key={status}
                        variant={patient.status === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(patient, status)}
                        disabled={patient.status === status || loadingStates[patient.id] === 'status'}
                        className="capitalize"
                      >
                        {loadingStates[patient.id] === 'status' ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          getStatusIcon(status)
                        )}
                        <span className="ml-1">{status}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No patients found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientList;
