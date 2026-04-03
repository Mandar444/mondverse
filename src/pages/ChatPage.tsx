import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Send, 
    Mic, 
    Volume2, 
    History, 
    AlertTriangle, 
    X, 
    RotateCcw, 
    ChevronDown, 
    Sparkles, 
    Phone, 
    ArrowLeft,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token') || '';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    content: string;
    created_at: Date;
    sentiment_score?: number;
}

const MOODS = [
    { label: 'Happy',    emoji: '😊', value: 'happy',    color: 'text-success' },
    { label: 'Okay',     emoji: '😐', value: 'okay',     color: 'text-warning' },
    { label: 'Sad',      emoji: '😢', value: 'sad',      color: 'text-primary' },
    { label: 'Anxious',  emoji: '😰', value: 'anxious',  color: 'text-accent' },
    { label: 'Stressed', emoji: '😤', value: 'stressed', color: 'text-destructive' },
    { label: 'Angry',    emoji: '😠', value: 'angry',    color: 'text-destructive' },
];

const QUICK_PROMPTS = [
    "I'm feeling really anxious today 😟",
    "Help me calm down right now",
    "I can’t stop overthinking",
    "Give me a breathing exercise",
];

const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);
};

const formatDateDivider = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

export default function ChatPage() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<'mood' | 'chat' | 'end'>('mood');
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [mood, setMood] = useState('');
    const [stressBefore, setStressBefore] = useState(5);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [emergency, setEmergency] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!showScrollDown) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading, showScrollDown]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
        setShowScrollDown(!isAtBottom);
    };

    const startSession = async () => {
        if (!mood) return;
        try {
            const res = await fetch(`${API}/chat/session/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ moodBefore: mood, stressLevelBefore: stressBefore }),
            });
            const data = await res.json();
            if (data.success) setSessionId(data.sessionId);
        } catch (err) {
            console.error("Session start failed", err);
        }

        setMessages([{
            id: 'welcome',
            sender: 'bot',
            content: `Hello! I'm Aura, your MindBridge guide. I see you're feeling ${mood} today. I'm here to listen and provide architectural clarity. What's on your mind?`,
            created_at: new Date(),
        }]);
        setPhase('chat');
    };

    const send = useCallback(async (text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg || loading) return;
        setInput('');
        if (inputRef.current) inputRef.current.style.height = 'auto';

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: msg, created_at: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await fetch(`${API}/chat/ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ message: msg, sessionId }),
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message);

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                content: data.reply,
                created_at: new Date(),
                sentiment_score: data.sentiment?.score
            }]);

            if (data.emergency?.emergency) setEmergency(true);
        } catch (err: any) {
            toast.error("Connecting to server...");
        } finally {
            setLoading(false);
        }
    }, [input, loading, sessionId]);

    const groupedMessages = useMemo(() => {
        const groups: { date: string, msgs: Message[] }[] = [];
        messages.forEach(m => {
            const dateStr = formatDateDivider(new Date(m.created_at));
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.date === dateStr) {
                lastGroup.msgs.push(m);
            } else {
                groups.push({ date: dateStr, msgs: [m] });
            }
        });
        return groups;
    }, [messages]);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    if (phase === 'mood') return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa]">
            <Card className="harmonic-glass border-white/50 max-w-lg w-full shadow-2xl">
                <CardContent className="p-10 space-y-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="p-4 bg-teal-50 rounded-full shadow-soft animate-breathe">
                                <Sparkles className="w-12 h-12 text-teal-600" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-serif font-black tracking-tighter italic">How are you breathing today?</h1>
                        <p className="text-slate-500 font-medium">Establishing neural resonance...</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {MOODS.map(m => (
                            <button 
                                key={m.value} 
                                onClick={() => setMood(m.value)} 
                                className={`flex flex-col items-center p-5 rounded-3xl transition-all duration-500 ${mood === m.value ? 'bg-teal-50 shadow-inner scale-105 border border-teal-100' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <span className="text-4xl mb-3">{m.emoji}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Stress Level</span>
                            <span className={stressBefore > 7 ? 'text-rose-600' : 'text-teal-600'}>{stressBefore}/10</span>
                        </div>
                        <input 
                            type="range" min="1" max="10" value={stressBefore} 
                            onChange={(e) => setStressBefore(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                        />
                    </div>

                    <Button 
                        onClick={startSession} 
                        disabled={!mood} 
                        className="w-full h-16 rounded-2xl btn-aura text-xs uppercase tracking-[0.3em]"
                    >
                        Initialize Sanctuary
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-[#fafafa] relative overflow-hidden">
            <div className="fixed inset-0 z-0 bg-[#fafafa]" />

            <header className="sticky top-0 z-50 harmonic-glass mx-6 mt-6 mb-4 p-5 flex items-center justify-between border-white shadow-soft">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-3 hover:bg-teal-50 rounded-full transition-colors lg:hidden">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center border border-white shadow-inner">
                            <Sparkles className="w-7 h-7 text-teal-600 animate-pulse" />
                        </div>
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    </div>
                    <div>
                        <h2 className="font-serif font-black text-xl leading-tight uppercase tracking-tighter italic">Aura Guide</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-teal-600/60">
                            {loading ? 'Neural Link Syncing...' : 'Active · MindBridge Resonance'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => setPhase('end')} 
                        variant="outline" 
                        className="rounded-full border-rose-100 text-rose-600 hover:bg-rose-50 px-6 h-12 text-[10px] uppercase font-black tracking-widest"
                    >
                        Close Session
                    </Button>
                </div>
            </header>

            {emergency && (
                <div className="mx-6 mb-4 bg-rose-50 border border-rose-100 p-4 rounded-3xl flex items-center gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-black text-rose-900 uppercase tracking-widest">Sanctuary Override</p>
                        <p className="text-xs text-rose-600 font-medium">Clinical helpline iCall: 9152987821</p>
                    </div>
                    <button onClick={() => setEmergency(false)} className="p-2 hover:bg-rose-100 rounded-full transition-colors">
                        <X className="w-4 h-4 text-rose-600" />
                    </button>
                </div>
            )}

            <div 
                ref={scrollRef} 
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-6 py-8 space-y-10 scrollbar-hide relative z-10"
            >
                {groupedMessages.map((group, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="flex items-center justify-center">
                            <span className="px-5 py-2 rounded-full bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">{group.date}</span>
                        </div>
                        {group.msgs.map(m => (
                            <div 
                                key={m.id} 
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div className={`flex gap-4 max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {m.sender === 'bot' && (
                                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shadow-soft flex-shrink-0 mt-1 border border-white">
                                            <Sparkles className="w-5 h-5 text-teal-600" />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className={`p-6 rounded-[2.5rem] shadow-soft ${
                                            m.sender === 'user' 
                                            ? 'bg-teal-600 text-white rounded-tr-none' 
                                            : 'harmonic-glass text-slate-800 rounded-tl-none border-white shadow-harmonic'
                                        }`}>
                                            <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                                                {m.content}
                                            </p>
                                        </div>
                                        <div className={`flex items-center px-4 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                                                {formatTime(new Date(m.created_at))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-white shadow-soft">
                                <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
                            </div>
                            <div className="harmonic-glass p-5 rounded-3xl rounded-tl-none border-white">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-teal-600/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-teal-600/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-teal-600/30 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-8 relative z-20">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="harmonic-glass p-3 shadow-harmonic flex items-end gap-3 border-white rounded-[2.5rem]">
                        <Button 
                            onClick={toggleListening} 
                            variant="ghost" 
                            size="icon" 
                            className={`rounded-full w-12 h-12 flex-shrink-0 transition-all ${isListening ? 'bg-rose-50 text-rose-600 animate-pulse' : 'text-slate-400 hover:bg-teal-50 hover:text-teal-600'}`}
                        >
                            <Mic className="w-6 h-6" />
                        </Button>
                        
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    send();
                                }
                            }}
                            placeholder={isListening ? "Resonating..." : "Establish neural link with Aura..."}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium py-3 px-2 min-h-[44px] max-h-40 resize-none scrollbar-hide leading-relaxed placeholder:text-slate-400"
                            rows={1}
                        />

                        <Button 
                            onClick={() => send()} 
                            disabled={!input.trim() || loading}
                            size="icon" 
                            className="btn-aura rounded-2xl w-12 h-12 shadow-glow flex-shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                        >
                            <Send className="w-6 h-6 text-white" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>Clinical Override: 9152987821</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                        <span>Synchronized Clinical Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
}