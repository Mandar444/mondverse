import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Stethoscope, Activity, TrendingUp, AlertCircle, 
  Search, Shield, Lock, ArrowRight, Server, Database, Settings,
  CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token') || '';

const GROWTH_DATA = [
    { date: '2024-03-25', users: 120 },
    { date: '2024-03-26', users: 145 },
    { date: '2024-03-27', users: 180 },
    { date: '2024-03-28', users: 210 },
    { date: '2024-03-29', users: 240 },
    { date: '2024-03-30', users: 290 },
    { date: '2024-03-31', users: 350 },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const [uRes, aRes] = await Promise.all([
                fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${getToken()}` } }),
                fetch(`${API}/admin/alerts`, { headers: { Authorization: `Bearer ${getToken()}` } })
            ]);
            const uData = await uRes.json();
            const aData = await aRes.json();

            if (uData.success) setUsers(uData.data);
            if (aData.success) setAlerts(aData.data);
        } catch (err) {
            console.error("Admin fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleUserStatus = async (userId: number, currentStatus: number) => {
        try {
            await fetch(`${API}/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ isActive: currentStatus ? 0 : 1 })
            });
            toast.success("Node Resonance Updated");
            fetchData();
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="flex flex-col items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center animate-pulse">
                    <Shield className="w-12 h-12 text-teal-600 animate-float-harmonic" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-700/50">Accessing Nexus Hub Assets...</p>
            </div>
        </div>
    );

    const filteredUsers = users.filter(u => 
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen relative selection:bg-teal-100 selection:text-teal-900 pt-48 pb-20 overflow-hidden bg-[#fafafa]">
            <Navbar userRole="admin" onLogout={handleLogout} />
            <div className="fixed inset-0 z-0 bg-[#fafafa]" />

            {/* 🛡️ SYSTEM AUTHORITY BRANDING ── INSTANT SEPARATION */}
            <div className="fixed top-24 left-0 right-0 z-40 px-6 animate-slide-down pointer-events-none">
                <div className="container mx-auto flex justify-end">
                    <div className="harmonic-glass border-amber-500/20 bg-amber-50/80 px-8 py-3 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xl border-l-[6px] border-l-amber-600">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700/60 leading-none mb-1">System Authoritative</p>
                            <h3 className="text-lg font-black text-slate-800 tracking-tighter italic">NEXUS MASTER <span className="text-amber-600">(ADMIN)</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 space-y-16 relative z-10">
                
                <header className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12 text-center lg:text-left">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full harmonic-glass border-white/50 text-[10px] font-black uppercase tracking-widest text-teal-700 shadow-soft">
                            <Lock className="w-4 h-4 text-emerald-500" />
                            System Authority: SuperNexus
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-serif font-black tracking-tighter text-slate-900 leading-tight italic">
                            MindBridge <span className="text-aura-gradient not-italic">Nexus Control</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0">
                            Overseeing <span className="text-teal-600 font-black underline decoration-teal-200">{users.length} neural nodes</span>. 
                            Global system stability at <span className="text-emerald-600 font-black">99.98%</span>.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-end gap-6 h-fit pt-4 text-left">
                        <Button variant="outline" className="h-16 w-16 rounded-2xl border-white bg-white/50 backdrop-blur-md shadow-harmonic hover:bg-white active:scale-95 transition-all">
                            <Settings className="w-6 h-6 text-teal-600" />
                        </Button>
                        <Button className="btn-aura h-16 px-12 text-xs shadow-2xl">
                            Generate Audit Resonance
                            <ArrowRight className="ml-3 w-5 h-5" />
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
                    {[
                        { label: 'Collective Pulse', val: users.length * 12, change: '+24%', icon: Activity, color: 'bg-teal-50', text: 'text-teal-600' },
                        { label: 'Clinical Anchors', val: users.filter(u => u.role === 'psychiatrist').length, change: '+2', icon: Stethoscope, color: 'bg-emerald-50', text: 'text-emerald-600' },
                        { label: 'Sync Latency', val: '12ms', change: 'Stable', icon: Server, color: 'bg-sky-50', text: 'text-sky-600' },
                        { label: 'Security Alerts', val: alerts.length, change: 'Active', icon: Shield, color: 'bg-rose-50', text: 'text-rose-600' },
                    ].map((stat, i) => (
                        <Card key={i} className="hover:bg-white/60 border-white/60 p-8 space-y-6 animate-fade-in text-left rounded-[3rem] shadow-soft transition-all duration-700 hover:-translate-y-4" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex items-center justify-between">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-white/50", stat.color)}>
                                    <stat.icon className={cn("w-7 h-7", stat.text)} />
                                </div>
                                <span className="text-[10px] font-black bg-white/50 px-3 py-1.5 rounded-full text-slate-500 border border-white shadow-soft">{stat.change}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-5xl font-black tracking-tighter text-slate-900">{stat.val}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="management" className="space-y-16">
                    <TabsList className="bg-white/40 p-2 rounded-[2.5rem] border border-white/60 backdrop-blur-3xl w-fit shadow-harmonic mx-auto lg:mx-0">
                        <TabsTrigger value="management" className="rounded-[2rem] px-12 py-4 data-[state=active]:bg-white data-[state=active]:shadow-soft font-black text-xs uppercase tracking-widest text-slate-500 data-[state=active]:text-teal-600 transition-all italic">Ecosystem Node Map</TabsTrigger>
                        <TabsTrigger value="intelligence" className="rounded-[2rem] px-12 py-4 data-[state=active]:bg-white data-[state=active]:shadow-soft font-black text-xs uppercase tracking-widest text-slate-500 data-[state=active]:text-teal-600 transition-all italic">Anomalies</TabsTrigger>
                    </TabsList>

                    <TabsContent value="management" className="animate-fade-in space-y-12">
                        <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 text-left">
                            <h2 className="text-4xl font-serif font-black tracking-tight text-slate-900 italic">Neural Node Distribution</h2>
                            <div className="relative shadow-harmonic rounded-[2rem] group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                                <input 
                                    placeholder="Search neural identifiers..." 
                                    className="input-resonance pl-14 w-[360px] text-xs h-14"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </section>

                        <Card className="harmonic-glass border-white/60 shadow-harmonic overflow-hidden p-0 text-left backdrop-blur-3xl">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/30">
                                            {['Neural Node', 'Role Designation', 'Security Status', 'Action Command'].map((h, i) => (
                                                <th key={i} className="text-left p-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map((user, i) => (
                                            <tr key={i} className="group hover:bg-teal-50/30 transition-colors duration-500 cursor-pointer">
                                                <td className="p-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-soft flex items-center justify-center font-black text-teal-600 text-xs">#{(i+1).toString().padStart(2, '0')}</div>
                                                        <div className="space-y-1">
                                                            <p className="font-black text-slate-900 text-lg">{user.full_name || 'Anonymous Node'}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-8">
                                                    <Badge variant="outline" className={cn(
                                                        "rounded-full px-5 py-1.5 font-black text-[10px] uppercase tracking-widest border border-white shadow-soft",
                                                        user.role === 'admin' ? "bg-amber-50 text-amber-700" : 
                                                        user.role === 'psychiatrist' ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
                                                    )}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="p-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-2.5 h-2.5 rounded-full", user.is_active ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500')} />
                                                        <span className="text-sm font-black text-slate-600">{user.is_active ? 'Optimal Resonance' : 'Connection Blocked'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-right">
                                                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                        <Button 
                                                            onClick={() => toggleUserStatus(user.user_id, user.is_active)}
                                                            variant="outline" 
                                                            className="h-10 rounded-xl border-white/60 bg-white/50 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white shadow-soft transition-all"
                                                        >
                                                            {user.is_active ? <XCircle className="mr-2 w-4 h-4 text-rose-500" /> : <CheckCircle2 className="mr-2 w-4 h-4 text-emerald-500" />}
                                                            {user.is_active ? 'Deactivate' : 'Activate'}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="intelligence" className="animate-fade-in space-y-12">
                         <Card className="harmonic-glass border-white/60 p-10 space-y-8 bg-rose-50/20 backdrop-blur-3xl shadow-harmonic text-left">
                            <CardTitle className="text-3xl font-serif font-black flex gap-4 items-center text-rose-600 italic">
                                <AlertCircle className="w-8 h-8" />
                                Security Anomalies ({alerts.length})
                            </CardTitle>
                            <div className="space-y-6">
                                {alerts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                        <Shield className="w-16 h-16 text-rose-300 animate-float-harmonic" />
                                        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em]">Integrity Protocol Normalized</p>
                                    </div>
                                ) : (
                                    alerts.map((alert, i) => (
                                        <div key={i} className="p-8 rounded-[3rem] bg-white text-left border border-white flex gap-6 items-center shadow-harmonic group transition-all hover:-translate-x-2">
                                            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
                                                <AlertCircle className="w-6 h-6 text-rose-500" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="font-black text-rose-900">{alert.full_name}</p>
                                                <p className="text-xs text-rose-500/60 font-medium">Flagged Synapse: <span className="font-black underline">{alert.trigger_type}</span></p>
                                            </div>
                                            <Badge className="bg-rose-600 px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest">{alert.severity}</Badge>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Now</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Card className="relative overflow-hidden rounded-[5rem] border-white/60 shadow-2xl group bg-gradient-to-br from-teal-500 to-indigo-700 p-20 text-white text-left">
                     <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                        <div className="w-32 h-32 rounded-[3rem] bg-white/20 backdrop-blur-3xl border border-white/40 flex items-center justify-center shrink-0 shadow-2xl animate-float-harmonic transition-transform duration-1000 group-hover:rotate-12">
                            <Shield className="w-16 h-16 text-white" />
                        </div>
                        <div className="flex-1 space-y-6">
                            <h3 className="text-5xl lg:text-6xl font-serif font-black tracking-tighter italic">MindBridge Nexus Fortress</h3>
                            <p className="text-xl text-white/80 font-medium max-w-2xl leading-relaxed">
                                All platform synapses are encrypted with <span className="text-white font-black underline decoration-white/40">RSA-4096</span> and shadowed by our active AI monitoring protocol. Your current sanctuary session is completely protected by the Aura Harmonic Firewall.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-white bg-white/20 px-12 py-6 rounded-[2.5rem] border border-white/30 backdrop-blur-2xl shadow-2xl animate-pulse">
                                <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)]" />
                                Nexus: Secured
                            </div>
                        </div>
                     </div>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboard;
