import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Stethoscope, Activity, TrendingUp, AlertCircle, 
  Search, Plus, Edit, Trash2, ArrowRight,
  Sparkles, Heart, Brain, Calendar, ShieldCheck,
  TrendingDown, Star, MessageCircle, FileText, Settings,
  Globe, Sun, Moon, Wind, Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import NeuralPulse from '@/components/NeuralPulse';
import { cn } from '@/lib/utils';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token') || '';

const ANALYTICS_DATA = [
    { date: '2024-03-25', stress: 65, sentiment: 40 },
    { date: '2024-03-26', stress: 58, sentiment: 52 },
    { date: '2024-03-27', stress: 72, sentiment: 35 },
    { date: '2024-03-28', stress: 45, sentiment: 68 },
    { date: '2024-03-29', stress: 50, sentiment: 62 },
    { date: '2024-03-30', stress: 38, sentiment: 82 },
    { date: '2024-03-31', stress: 42, sentiment: 78 },
];

const PsychiatristDashboard = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const res = await fetch(`${API}/psychiatrist/patients`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.success) setPatients(data.data);
        } catch (err) {
            console.error("Psych fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="flex flex-col items-center gap-12">
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 bg-teal-500/10 blur-[80px] rounded-full animate-pulse" />
                    <NeuralPulse size="lg" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-700/50 italic animate-pulse">Establishing Neural Link...</p>
            </div>
        </div>
    );

    const filteredPatients = patients.filter(p => 
        p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen relative selection:bg-teal-100 selection:text-teal-900 pt-48 pb-20 overflow-hidden bg-[#fafafa]">
            <Navbar userRole="psychiatrist" onLogout={handleLogout} />
            <div className="fixed inset-0 z-0 bg-[#fafafa]" />

            {/* 🩺 CLINICAL IDENTITY BRANDING ── INSTANT SEPARATION */}
            <div className="fixed top-24 left-0 right-0 z-40 px-6 animate-slide-down pointer-events-none">
                <div className="container mx-auto flex justify-end">
                    <div className="harmonic-glass border-indigo-500/20 bg-indigo-50/80 px-8 py-3 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xl border-l-[6px] border-l-indigo-600">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                            <Stethoscope className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-700/60 leading-none mb-1">Clinical Session</p>
                            <h3 className="text-lg font-black text-slate-800 tracking-tighter italic">GUIDE <span className="text-indigo-600">(PSYCHIATRIST)</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 space-y-24 relative z-10">
                <header className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12 text-center lg:text-left">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full harmonic-glass border-white/50 text-[10px] font-black uppercase tracking-[0.4em] text-teal-700 shadow-soft animate-breathe">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            Clinical Presence Authorized
                        </div>
                        <h1 className="text-6xl lg:text-[7rem] font-serif font-black tracking-tighter text-slate-900 leading-none italic">
                            Welcome, <span className="text-teal-600 not-italic">Dr. Clinical.</span>
                        </h1>
                        <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed text-left">
                            Your <span className="text-slate-800 font-black underline decoration-teal-200">Neural Folders</span> are synchronized. 
                            Global sanctuary alignment is optimal.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-end gap-6 pt-4 h-fit">
                        <Button className="btn-aura-outline h-20 px-12 border-white/60 bg-white/40 backdrop-blur-3xl shadow-iris">
                            <Search className="mr-3 w-5 h-5 text-teal-600" />
                            Synchronize Nodes
                        </Button>
                        <Button className="btn-aura h-20 px-16 shadow-2xl text-lg uppercase tracking-widest">
                            New Clinical Entry
                            <ArrowRight className="ml-3 w-6 h-6" />
                        </Button>
                    </div>
                </header>

                <section className="space-y-16 animate-slide-up">
                    <div className="flex items-center justify-between pb-8 border-b border-slate-100 text-left">
                         <div className="space-y-3">
                             <h2 className="text-4xl font-serif font-black text-slate-900 leading-tight italic">Assigned Neural Nodes</h2>
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Clinical Resonance Monitor</p>
                         </div>
                         <div className="flex bg-slate-50/50 p-2 rounded-[2rem] border border-slate-100 shadow-inner">
                            <Button variant="ghost" className="rounded-[1.5rem] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-teal-600 bg-white shadow-soft">Active nodes</Button>
                            <Button variant="ghost" className="rounded-[1.5rem] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Dormant sync</Button>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredPatients.map((patient, i) => (
                            <Card key={i} className="group hover:bg-white/60 p-12 space-y-10 cursor-pointer overflow-hidden relative shadow-soft border-white/60 rounded-[4rem] transition-all duration-700 hover:-translate-y-4 text-left" onClick={() => navigate('/psychiatrist/report')}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-2xl group-hover:from-white/40 transition-all duration-700" />
                                <div className="flex items-center justify-between">
                                    <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center border border-white/50 shadow-inner bg-teal-50">
                                        <Heart className="w-10 h-10 text-teal-600" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Resonance</p>
                                        <p className="text-3xl font-black italic text-teal-600">+12%</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-serif font-black text-slate-800 leading-none italic">{patient.full_name}</h3>
                                    <p className="text-sm font-medium text-slate-400">{patient.email}</p>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity Index</p>
                                        <p className="text-base font-black text-slate-900 italic">{patient.latest_stress || 42}%</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-white">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000 bg-teal-500" 
                                            style={{ width: `${patient.latest_stress || 42}%` }} 
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-12 text-left">
                    <Card className="lg:col-span-2 harmonic-glass border-white/60 p-12 space-y-12 backdrop-blur-3xl shadow-iris relative group overflow-hidden rounded-[4rem]">
                        <div className="absolute inset-0 bg-white/10" />
                        <div className="flex items-center justify-between flex-wrap gap-6 relative z-10">
                            <div className="space-y-4">
                                <CardTitle className="text-4xl font-serif font-black text-slate-900 italic">Collective Neural Resonance</CardTitle>
                                <CardDescription className="text-lg font-medium text-slate-500">Comparing stress nodes vs empathetic sentiment cycles</CardDescription>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-teal-500 shadow-sm animate-pulse" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sentiment</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm animate-pulse" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stress</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[400px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ANALYTICS_DATA}>
                                    <defs>
                                        <linearGradient id="cliniStress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="cliniSent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" hide />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '2rem', border: '1px solid white' }} />
                                    <Area type="monotone" dataKey="stress" stroke="#6366f1" strokeWidth={6} fill="url(#cliniStress)" animationDuration={2000} />
                                    <Area type="monotone" dataKey="sentiment" stroke="#14b8a6" strokeWidth={6} fill="url(#cliniSent)" animationDuration={2500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="lg:col-span-1 relative overflow-hidden rounded-[4rem] border-white/60 shadow-iris group bg-[#fafafa] p-16 text-slate-900 border">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-teal-50/50 backdrop-blur-3xl" />
                        <div className="relative z-10 h-full flex flex-col justify-between items-center text-center">
                            <div className="space-y-12">
                                <div className="relative flex justify-center">
                                    <div className="absolute inset-0 bg-teal-500/10 blur-[80px] rounded-full animate-pulse" />
                                    <NeuralPulse size="md" />
                                </div>
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600 italic">Aura Intelligence Active</p>
                                    <blockquote className="text-3xl font-serif font-black leading-relaxed italic text-slate-800">
                                        "4 nodes are exhibiting abnormal neural oscillations in the evening. Recommended: Batch initiation of calming rhythms."
                                    </blockquote>
                                </div>
                            </div>
                            <Button className="btn-aura w-full h-20 mt-20 text-xs tracking-widest uppercase shadow-2xl">
                                Initiate Batch Harmony
                                <ArrowRight className="ml-4 w-5 h-5" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default PsychiatristDashboard;