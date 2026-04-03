import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  AlertTriangle, 
  Phone, 
  CheckCircle2, 
  Eye,
  XCircle,
  Loader2
} from 'lucide-react';
import { EmergencyAlert } from '@/types';

interface EmergencyAlertsProps {
  alerts: EmergencyAlert[];
  onAcknowledge: (alertId: string) => void;
  onCallPatient: (alert: EmergencyAlert) => void;
  onViewDetails: (alert: EmergencyAlert) => void;
}

const EmergencyAlerts = ({ 
  alerts, 
  onAcknowledge, 
  onCallPatient, 
  onViewDetails 
}: EmergencyAlertsProps) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    alertId: string;
    action: 'acknowledge' | 'call';
    patientName: string;
    phone?: string;
  }>({ open: false, alertId: '', action: 'acknowledge', patientName: '' });
  
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const getSeverityColor = (severity: EmergencyAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-warning text-warning-foreground';
      case 'medium':
        return 'bg-accent text-accent-foreground';
    }
  };

  const getAlertTypeLabel = (type: EmergencyAlert['alertType']) => {
    switch (type) {
      case 'crisis':
        return 'Crisis Alert';
      case 'missed-session':
        return 'Missed Session';
      case 'high-stress':
        return 'High Stress Detected';
      case 'self-harm-risk':
        return 'Self-Harm Risk';
    }
  };

  const handleAcknowledge = (alert: EmergencyAlert) => {
    console.log('Opening acknowledge dialog for:', alert.patientName);
    setConfirmDialog({
      open: true,
      alertId: alert.id,
      action: 'acknowledge',
      patientName: alert.patientName,
    });
  };

  const handleCall = (alert: EmergencyAlert) => {
    console.log('Opening call dialog for:', alert.patientName);
    setConfirmDialog({
      open: true,
      alertId: alert.id,
      action: 'call',
      patientName: alert.patientName,
      phone: alert.phone,
    });
  };

  const confirmAction = async () => {
    const { alertId, action, patientName, phone } = confirmDialog;
    
    setLoadingStates(prev => ({ ...prev, [alertId]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (action === 'acknowledge') {
      console.log(`Acknowledged alert for ${patientName}`);
      alert(`✅ Alert acknowledged for ${patientName}\n\nThe alert has been marked as reviewed.`);
      onAcknowledge(alertId);
    } else {
      console.log(`Calling ${patientName} at ${phone}`);
      alert(`📞 Calling ${patientName}...\n\nDialing: ${phone}\n\nCall initiated successfully.`);
      const foundAlert = alerts.find(a => a.id === alertId);
      if (foundAlert) onCallPatient(foundAlert);
    }
    
    setLoadingStates(prev => ({ ...prev, [alertId]: false }));
    setConfirmDialog({ open: false, alertId: '', action: 'acknowledge', patientName: '' });
  };

  const handleViewDetails = (emergencyAlert: EmergencyAlert) => {
    console.log('Viewing details for:', emergencyAlert.patientName);
    window.alert(`📋 Patient Details: ${emergencyAlert.patientName}\n\n` +
      `Alert Type: ${getAlertTypeLabel(emergencyAlert.alertType)}\n` +
      `Severity: ${emergencyAlert.severity.toUpperCase()}\n` +
      `Message: ${emergencyAlert.message}\n` +
      `Time: ${emergencyAlert.timestamp}\n` +
      `Phone: ${emergencyAlert.phone}`);
    onViewDetails(emergencyAlert);
  };

  if (alerts.length === 0) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="font-medium text-foreground">No Emergency Alerts</p>
            <p className="text-sm text-muted-foreground">All patients are stable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-destructive/30 bg-destructive/5 fade-in-up">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            Emergency Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{alert.avatar}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{alert.patientName}</p>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getAlertTypeLabel(alert.alertType)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Last check-in: {alert.timestamp}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleCall(alert)}
                    disabled={loadingStates[alert.id]}
                    className="flex items-center gap-2"
                  >
                    {loadingStates[alert.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    Call Patient
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(alert)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleAcknowledge(alert)}
                    disabled={loadingStates[alert.id]}
                    className="flex items-center gap-2 text-success hover:text-success hover:bg-success/10"
                  >
                    {loadingStates[alert.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === 'acknowledge' 
                ? 'Acknowledge Alert?' 
                : 'Call Patient?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === 'acknowledge' 
                ? `Are you sure you want to acknowledge the alert for ${confirmDialog.patientName}? This will remove the alert from the emergency list.`
                : `You are about to call ${confirmDialog.patientName} at ${confirmDialog.phone}. Continue?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className={confirmDialog.action === 'call' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {confirmDialog.action === 'acknowledge' ? 'Acknowledge' : 'Call Now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmergencyAlerts;
