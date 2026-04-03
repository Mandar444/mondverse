// Patient Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  stressLevel: number;
  lastSession: string;
  lastCheckIn: string;
  status: 'critical' | 'stable' | 'in-session' | 'monitoring';
  avatar: string;
  notes: string;
  nextAppointment?: string;
  riskLevel: 'high' | 'medium' | 'low';
  conditions: string[];
}

// Emergency Alert Types
export interface EmergencyAlert {
  id: string;
  patientId: string;
  patientName: string;
  avatar: string;
  phone: string;
  alertType: 'crisis' | 'missed-session' | 'high-stress' | 'self-harm-risk';
  severity: 'critical' | 'high' | 'medium';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  avatar: string;
  type: 'video' | 'in-person' | 'phone';
  time: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

// Message Types
export interface Message {
  id: string;
  patientId: string;
  patientName: string;
  avatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'urgent' | 'normal' | 'low';
}

// Statistics Types
export interface DashboardStats {
  activePatients: number;
  todayAppointments: number;
  pendingMessages: number;
  criticalAlerts: number;
  completedSessions: number;
  averageStress: number;
}

// Quick Action Types
export type QuickActionType = 'messages' | 'appointments' | 'patients' | 'notes' | 'settings' | 'reports';
