import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Settings,
  Users,
  MessageCircle,
  FileText,
  MoreVertical,
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
  Stethoscope,
  Sparkles
} from 'lucide-react';

const SessionInterface = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  // Mock session data
  const session = {
    appointmentId: id,
    patientName: 'Sarah Johnson',
    patientAge: 28,
    sessionType: 'Video Call',
    duration: '0:45:32',
    status: 'In Progress',
  };

  const handleEndCall = () => {
    if (confirm('Are you sure you want to end this session?')) {
      // Save notes if any
      if (notes) {
        console.log('Saving session notes:', notes);
      }
      navigate('/psychiatrist');
    }
  };

  const handleAddNote = () => {
    setShowNotes(!showNotes);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Session Info Bar */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-900 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center shadow-inner border border-white">
                <User className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-black text-white italic uppercase tracking-widest">{session.patientName}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">{session.sessionType} • {session.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              {session.status}
            </span>
            <Button variant="ghost" size="sm" className="text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Video */}
            <Card className="bg-gray-900 border-gray-800 aspect-video flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-teal-500/5 blur-[100px] group-hover:bg-teal-500/10 transition-all" />
              <div className="text-center relative z-10 space-y-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center mx-auto shadow-2xl animate-float-harmonic">
                    <User className="w-16 h-16 text-white/40" />
                </div>
                <p className="text-2xl font-semibold text-white mb-2">{session.patientName}</p>
                <p className="text-gray-400">Video Call Active</p>
                {!isVideoOn && (
                  <p className="text-sm text-yellow-500 mt-2">Your camera is off</p>
                )}
              </div>
            </Card>

            {/* Self View */}
            <div className="relative">
              <Card className="bg-gray-800 border-gray-700 w-48 h-36 flex items-center justify-center overflow-hidden">
                {isVideoOn ? (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-2 mx-auto">
                        <Stethoscope className="w-6 h-6 text-teal-400" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Clinical Guide</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoOff className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Camera Off</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant={isMicOn ? 'outline' : 'destructive'}
                className="rounded-full w-14 h-14 p-0"
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </Button>

              <Button
                size="lg"
                variant={isVideoOn ? 'outline' : 'destructive'}
                className="rounded-full w-14 h-14 p-0"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
              </Button>

              <Button
                size="lg"
                variant={isSoundOn ? 'outline' : 'destructive'}
                className="rounded-full w-14 h-14 p-0"
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                {isSoundOn ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-14 h-14 p-0"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-14 h-14 p-0"
                onClick={handleEndCall}
              >
                <Phone className="w-5 h-5 rotate-[135deg]" />
              </Button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-white font-semibold mb-3">Session Tools</h3>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={handleAddNote}
                >
                  <FileText className="w-4 h-4" />
                  {showNotes ? 'Hide Notes' : 'Session Notes'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={() => navigate(`/psychiatrist/patient/${session.appointmentId}`)}
                >
                  <Users className="w-4 h-4" />
                  Patient Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
              </CardContent>
            </Card>

            {/* Session Notes */}
            {showNotes && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-3">Session Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this session..."
                    rows={10}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <Button
                    className="w-full mt-2"
                    onClick={() => {
                      console.log('Saving notes:', notes);
                      alert('Notes saved successfully!');
                    }}
                  >
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Patient Info */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3">Patient Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{session.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Age:</span>
                    <span className="text-white">{session.patientAge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session:</span>
                    <span className="text-white">12th Session</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{session.sessionType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recording Notice */}
            <Card className="bg-red-900/20 border-red-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-pulse" />
                  <div>
                    <p className="text-sm text-red-300 font-medium">
                      Recording Disabled
                    </p>
                    <p className="text-xs text-red-400 mt-1">
                      For privacy and HIPAA compliance, sessions are not recorded.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Connection Info */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Connection: Excellent</span>
          </div>
          <span>•</span>
          <span>Encrypted End-to-End</span>
          <span>•</span>
          <span>HIPAA Compliant</span>
        </div>
      </main>
    </div>
  );
};

export default SessionInterface;