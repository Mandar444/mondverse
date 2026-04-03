import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AnimatedBot from '@/components/AnimatedBot';
import { 
  Brain, Mail, Lock, ArrowLeft, User, Stethoscope, 
  Settings, Eye, EyeOff, ShieldCheck, Sparkles, Heart, Zap, Globe, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type UserRole = 'user' | 'psychiatrist' | 'admin';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [role, setRole] = useState<UserRole>('user');

    // ... (rest of state)

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-[#f8fafc]">
            {/* ... (background code) */}

            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-20 relative z-10 items-center">
                {/* ... (branding code) */}

                {/* Form Architecture */}
                <div className="animate-slide-up">
                    <Card className="harmonic-glass border-white/60 p-12 lg:p-20 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none">
                            <Globe className="w-64 h-64 text-slate-900" />
                        </div>
                        
                        <CardHeader className="p-0 space-y-6 mb-12 relative z-10 text-left">
                            <div className="flex lg:hidden items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">MindBridge Aura</span>
                            </div>
                            <CardTitle className="text-5xl font-serif font-black text-slate-900 italic leading-tight">
                                {isLogin ? 'Welcome Home.' : 'Begin Your Path.'}
                            </CardTitle>
                        </CardHeader>

                        {/* 🔒 ROLE SEPARATION TABS ── INSTANT RECOGNITION */}
                        <Tabs defaultValue="user" onValueChange={(val) => setRole(val as UserRole)} className="mb-12 relative z-10">
                            <TabsList className="grid grid-cols-3 gap-3 p-2 bg-slate-100/50 rounded-2xl border border-white/40 h-auto">
                                <TabsTrigger value="user" className="flex-col gap-2 py-4 rounded-xl data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all group">
                                    <Heart className="w-5 h-5 group-data-[state=active]:animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Seeker</span>
                                </TabsTrigger>
                                <TabsTrigger value="psychiatrist" className="flex-col gap-2 py-4 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all group">
                                    <Stethoscope className="w-5 h-5 group-data-[state=active]:animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Guide</span>
                                </TabsTrigger>
                                <TabsTrigger value="admin" className="flex-col gap-2 py-4 rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all group">
                                    <Shield className="w-5 h-5 group-data-[state=active]:animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Nexus</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <CardContent className="p-0 relative z-10 text-left">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {!isLogin && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Path Designation</label>
                                        <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                                            <SelectTrigger className="input-resonance h-16 bg-white/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-[2rem] border-white/50 backdrop-blur-3xl shadow-2xl bg-white/80">
                                                <SelectItem value="user" className="focus:bg-teal-50 font-bold p-4">Seeker (Patient)</SelectItem>
                                                <SelectItem value="psychiatrist" className="focus:bg-teal-50 font-bold p-4">Guide (Psychiatrist)</SelectItem>
                                                <SelectItem value="admin" className="focus:bg-teal-50 font-bold p-4">Nexus Master (Admin)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {!isLogin && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Sanctuary Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                                            <input
                                                className="input-resonance pl-16 w-full h-16"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Identifier..."
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Neural Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                                        <input
                                            type="email"
                                            className="input-resonance pl-16 w-full h-16"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@mindbridge.ai"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Secure Key</label>
                                        {isLogin && <Link to="#" className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700">Lost Key?</Link>}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="input-resonance pl-16 pr-16 w-full h-16"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Secret resonance..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-teal-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {generalError && (
                                    <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest text-center animate-pulse">
                                        {generalError}
                                    </div>
                                )}

                                <div className="pt-6">
                                    <Button 
                                        type="submit" 
                                        className="w-full btn-aura h-20 text-lg uppercase tracking-[0.4em] shadow-2xl" 
                                        disabled={loading}
                                    >
                                        {loading ? "Synchronizing..." : (isLogin ? "Enter Sanctuary" : "Establish Path")}
                                    </Button>
                                </div>

                                <div className="relative py-8 text-center overscroll-none">
                                    <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                                    <span className="relative bg-white/80 backdrop-blur-md px-10 text-[10px] font-black text-slate-300 tracking-[0.6em] uppercase mx-auto">OR</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-teal-600 transition-colors group"
                                >
                                    {isLogin ? "Generate New Node Identifier" : "Reconnect with Existing Sanctuary"}
                                    <ArrowRight className="inline-block ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;