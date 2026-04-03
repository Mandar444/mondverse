import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  RotateCcw, 
  Sparkles, 
  Wind, 
  Brain, 
  Palette, 
  CheckCircle2, 
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token') || '';

type GameId = 'bubble' | 'breathe' | 'memory' | 'doodle';

interface GameInfo {
  id: GameId; title: string; icon: any; desc: string; color: string; tag: string;
}

const GAMES: GameInfo[] = [
  { id: 'bubble',  title: 'Bubble Dissolve',    icon: Sparkles, color: 'text-teal-600', tag: 'Anxiety relief',  desc: 'Pop the translucent orbs—visual satisfaction engineered for cortisol reduction.' },
  { id: 'breathe', title: 'Neural Rhythm',      icon: Wind,     color: 'text-indigo-600', tag: 'Deep breathing',  desc: 'Sync your pulmonary cycle with the 4-7-8 harmonic rhythm to stabilize your CNS.' },
  { id: 'memory',  title: 'Nature Resonance',   icon: Brain,    color: 'text-emerald-600', tag: 'Focus & mindfulness', desc: 'Align peaceful nature pairs to recalibrate your neural focus and presence.' },
  { id: 'doodle',  title: 'Aura Flow',          icon: Palette,  color: 'text-amber-600', tag: 'Creative release', desc: 'Project your cognitive patterns onto a dark-mist canvas. Zero rules, zero friction.' },
];

function saveSession(gameType: string, score: number, duration: number) {
  fetch(`${API}/games/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ gameType, score, durationSeconds: duration, completed: true, stressReduction: Math.min(score / 10, 10) }),
  }).catch(() => {});
}

/* ═══════════════════════════════════════════════════════════════════
   GAME 1: BUBBLE POP (AURA RE-ENGINEERED)
   ═══════════════════════════════════════════════════════════════════ */
interface Bubble { id: number; x: number; y: number; r: number; color: string; }
const BUBBLE_COLORS = ['#2dd4bf','#5dd4ca','#818cf8','#a5b4fc','#34d399','#38bdf8','#94a3b8'];

function BubbleGame({ onBack }: { onBack: () => void }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore]     = useState(0);
  const [popped, setPopped]   = useState<number[]>([]);
  const startTime = useRef(Date.now());
  const nextId = useRef(0);

  const spawnBubble = useCallback(() => {
    const r = 24 + Math.random() * 28;
    setBubbles(prev => [...prev.slice(-25), {
      id: nextId.current++,
      x: r + Math.random() * (Math.min(window.innerWidth, 560) - r * 2),
      y: r + Math.random() * 300,
      r,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
    }]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnBubble, 700);
    return () => clearInterval(interval);
  }, [spawnBubble]);

  const pop = (id: number) => {
    setPopped(prev => [...prev, id]);
    setScore(s => s + 1);
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
      setPopped(prev => prev.filter(p => p !== id));
    }, 300);
  };

  const handleEnd = () => {
    saveSession('bubble_pop', score, Math.round((Date.now() - startTime.current) / 1000));
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button onClick={handleEnd} variant="ghost" className="rounded-full gap-2 text-slate-500 font-black tracking-widest uppercase text-[10px]">
          <ArrowLeft size={16}/> Sanctuary
        </Button>
        <h2 className="font-serif text-3xl font-black italic tracking-tighter text-slate-800">Bubble Dissolve</h2>
        <div className="px-4 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black uppercase tracking-widest border border-teal-100 shadow-soft">
          ⭐ {score}
        </div>
      </div>

      <div className="relative aspect-video rounded-[3rem] overflow-hidden harmonic-glass border-white shadow-harmonic">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/20 via-indigo-50/20 to-white pointer-events-none" />
        {bubbles.map(b => (
          <div key={b.id} onClick={() => pop(b.id)} style={{
            position: 'absolute',
            left: b.x - b.r, top: b.y - b.r,
            width: b.r * 2, height: b.r * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${b.color}22, ${b.color}44)`,
            border: `1.5px solid ${b.color}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: b.r * 0.7,
            transform: popped.includes(b.id) ? 'scale(1.8) rotate(15deg)' : 'scale(1)',
            opacity: popped.includes(b.id) ? 0 : 0.6,
            filter: popped.includes(b.id) ? 'blur(20px)' : 'blur(0px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: `0 8px 32px ${b.color}22`,
            userSelect: 'none',
          }}>
            {popped.includes(b.id) ? '✨' : ''}
          </div>
        ))}
        {bubbles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-black tracking-[0.4em] text-slate-400 animate-pulse">
            Neural Field Stabilizing...
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6">
        <p className="text-xs text-slate-400 font-medium tracking-wide">Orbs Populated: <span className="font-black text-slate-800">{score}</span></p>
        <Button onClick={() => { setScore(0); setBubbles([]); }} variant="ghost" className="rounded-full gap-2 text-slate-400 hover:text-teal-600 transition-colors uppercase font-black text-[10px] tracking-widest">
          <RotateCcw size={14}/> Reset Pulse
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GAME 2: 4-7-8 BREATHING (AURA PULSE)
   ═══════════════════════════════════════════════════════════════════ */
const PHASES = [
  { label: 'Harmonic Inhalation',  duration: 4, color: 'border-teal-400', bg: 'bg-teal-50', text: 'text-teal-700', scale: 'scale-[1.6]' },
  { label: 'Neural Suspension',   duration: 7, color: 'border-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-700', scale: 'scale-[1.6]' },
  { label: 'Resonant Release',    duration: 8, color: 'border-sky-400', bg: 'bg-sky-50', text: 'text-sky-700', scale: 'scale-[1]' },
];

function BreatheGame({ onBack }: { onBack: () => void }) {
  const [active,   setActive]   = useState(false);
  const [phase,    setPhase]    = useState(0);
  const [count,    setCount]    = useState(PHASES[0].duration);
  const [cycles,   setCycles]   = useState(0);
  const startTime = useRef(Date.now());
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    saveSession('breathing_478', cycles * 3, Math.round((Date.now() - startTime.current) / 1000));
  }, [cycles]);

  useEffect(() => {
    if (!active) return;
    let p = phase, c = PHASES[p].duration;
    setCount(c);
    timerRef.current = setInterval(() => {
      c--;
      if (c <= 0) {
        p = (p + 1) % PHASES.length;
        if (p === 0) setCycles(cy => cy + 1);
        c = PHASES[p].duration;
        setPhase(p);
      }
      setCount(c);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active]);

  const cur = PHASES[phase];

  return (
    <div className="max-w-2xl mx-auto space-y-16 animate-fade-in text-center">
      <div className="flex items-center justify-between">
        <Button onClick={() => { stop(); onBack(); }} variant="ghost" className="rounded-full gap-2 text-slate-500 font-black tracking-widest uppercase text-[10px]">
          <ArrowLeft size={16}/> Sanctuary
        </Button>
        <h2 className="font-serif text-3xl font-black italic tracking-tighter text-slate-800">Neural Rhythm</h2>
        <div className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100 shadow-soft">
          🔄 {cycles} cycles
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10">
        <div className={cn(
          "relative w-72 h-72 rounded-full border-4 border-white shadow-harmonic flex items-center justify-center flex-col transition-all duration-[1000ms] ease-in-out bg-white/40",
          active ? cur.scale : 'scale-100',
          active ? cur.color : 'border-slate-100'
        )}>
          <div className={cn("absolute inset-0 rounded-full blur-3xl opacity-20", active ? cur.bg : 'bg-transparent')} />
          <span className={cn("text-7xl font-sans font-black tracking-tighter relative z-10", active ? cur.text : 'text-slate-200')}>
            {active ? count : 'Establishing...'}
          </span>
          <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] mt-4 relative z-10", active ? cur.text : 'text-slate-300')}>
            {active ? cur.label : 'Begin Breath Sync'}
          </span>
        </div>
        
        <div className="mt-20 flex gap-12">
          {PHASES.map((p, i) => (
            <div key={i} className={cn("flex flex-col items-center gap-2 transition-opacity duration-500", active && phase === i ? 'opacity-100' : 'opacity-20')}>
                <div className={cn("w-3 h-3 rounded-full shadow-inner", p.bg)} />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{p.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => { if (active) stop(); else { setActive(true); setPhase(0); setCount(4); startTime.current = Date.now(); } }}
          className={cn(
            "mt-16 h-16 px-16 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] transition-all shadow-glow",
            active ? 'bg-rose-500 text-white' : 'btn-aura'
          )}
        >
          {active ? 'Terminate Sync' : 'Initialize Rhythm'}
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GAME 3: MEMORY MATCH (RESISTANCE NATURE)
   ═══════════════════════════════════════════════════════════════════ */
const EMOJIS = ['🌸','🌊','🌿','⭐','🦋','🌙','🌈','🍀'];
type CardData = { id: number; emoji: string; flipped: boolean; matched: boolean };

function MemoryGame({ onBack }: { onBack: () => void }) {
  const makeCards = () =>
    [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));

  const [cards,   setCards]   = useState<CardData[]>(makeCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves,   setMoves]   = useState(0);
  const [won,     setWon]     = useState(false);
  const startTime = useRef(Date.now());

  const flip = (id: number) => {
    if (flipped.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid)!);
      if (a.emoji === b.emoji) {
        setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c));
        setFlipped([]);
        if (cards.filter(c => c.matched).length + 2 === cards.length) {
          setWon(true);
          saveSession('memory_match', Math.max(0, 100 - moves * 5), Math.round((Date.now() - startTime.current) / 1000));
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 800);
      }
    }
  };

  const reset = () => { setCards(makeCards()); setFlipped([]); setMoves(0); setWon(false); startTime.current = Date.now(); };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" className="rounded-full gap-2 text-slate-500 font-black tracking-widest uppercase text-[10px]">
          <ArrowLeft size={16}/> Sanctuary
        </Button>
        <h2 className="font-serif text-3xl font-black italic tracking-tighter text-slate-800">Nature Resonance</h2>
        <div className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-soft">
          🎯 {moves} Pulse
        </div>
      </div>

      {won && (
        <div className="bg-emerald-50/60 backdrop-blur-xl border border-emerald-100 rounded-[3rem] p-10 text-center space-y-6 animate-float-harmonic shadow-harmonic">
          <Sparkles className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-3xl font-serif font-black italic text-emerald-800 tracking-tighter underline decoration-emerald-200">Resonance Established</h3>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-600/60">Phase Completed in {moves} moves</p>
          <Button onClick={reset} className="btn-aura px-12 h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest">Restart Cycle</Button>
        </div>
      )}

      {!won && (
        <div className="grid grid-cols-4 gap-6 p-2">
          {cards.map(card => (
            <div key={card.id} onClick={() => flip(card.id)} className={cn(
              "aspect-square rounded-[2rem] flex items-center justify-center text-5xl cursor-pointer transition-all duration-700 shadow-soft border-2",
              card.matched ? "bg-emerald-50 border-emerald-100 opacity-60 grayscale-[0.5]" : 
              card.flipped ? "bg-white border-white scale-105 shadow-harmonic rotate-12" : 
              "bg-gradient-to-br from-indigo-100 to-indigo-50 border-white hover:scale-105 hover:rotate-3"
            )}>
              {(card.flipped || card.matched) && <span className="animate-fade-in">{card.emoji}</span>}
              {!card.flipped && !card.matched && <Zap className="text-indigo-200 w-8 h-8 opacity-40 animate-pulse" />}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-6 opacity-60">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cards.filter(c => c.matched).length / 2} / {EMOJIS.length} Synchronized</span>
        <Button onClick={reset} variant="ghost" className="h-12 px-6 rounded-full gap-2 text-slate-400 font-black tracking-widest uppercase text-[10px] hover:text-emerald-600">
          <RotateCcw size={14}/> Recalibrate
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GAME 4: ZEN DOODLE (AURA FLOW)
   ═══════════════════════════════════════════════════════════════════ */
function DoodleGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [color, setColor] = useState('#6366f1');
  const [size, setSize] = useState(8);
  const startTime = useRef(Date.now());
  const strokes = useRef(0);

  const COLORS = ['#6366f1','#2dd4bf','#3b82f6','#ef4444','#f59e0b','#ec4899','#0f172a','#ffffff'];

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
        const touch = (e as React.TouchEvent).touches[0];
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current; if (!canvas) return;
    drawing.current = true;
    last.current = getPos(e, canvas);
    strokes.current++;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.9;
    ctx.stroke();
    last.current = pos;
  };

  const endDraw = () => { drawing.current = false; };

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    saveSession('zen_doodle', strokes.current, Math.round((Date.now() - startTime.current) / 1000));
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button onClick={handleSave} variant="ghost" className="rounded-full gap-2 text-slate-500 font-black tracking-widest uppercase text-[10px]">
          <ArrowLeft size={16}/> Sanctuary
        </Button>
        <h2 className="font-serif text-3xl font-black italic tracking-tighter text-slate-800">Aura Flow</h2>
        <Button onClick={clear} variant="outline" className="rounded-full gap-2 text-slate-400 font-black tracking-widest uppercase text-[10px] border-slate-100 hover:bg-slate-50">
          <RotateCcw size={14}/> Wipe Field
        </Button>
      </div>

      <div className="relative group rounded-[3rem] overflow-hidden shadow-harmonic border-white border-2">
         <canvas
            ref={canvasRef} width={600} height={400}
            className="w-full bg-[#0f172a] shadow-inner cursor-crosshair touch-none"
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          />
          <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full harmonic-glass text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 border-white/20 select-none">
            Freeform Neural Projection
          </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex gap-4 p-4 rounded-[2rem] bg-slate-50 border border-slate-100 items-center overflow-x-auto scrollbar-hide">
            {COLORS.map(c => (
              <div 
                key={c} 
                onClick={() => setColor(c)} 
                className={cn(
                    "w-8 h-8 rounded-full cursor-pointer transition-all border-2",
                    color === c ? "border-slate-900 scale-125" : "border-transparent opacity-60"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
        </div>
        <div className="flex items-center gap-6 px-8 py-4 rounded-[2rem] bg-slate-50 border border-slate-100 flex-1 ml-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Target size={12} /> Pulse
            </span>
            <input type="range" min={2} max={40} value={size} onChange={e => setSize(+e.target.value)} className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN GAMES PAGE (ZEN HUB)
   ═══════════════════════════════════════════════════════════════════ */
export default function GamesPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<GameId | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [active]);

  if (active === 'bubble')  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafa]">
      <BubbleGame onBack={() => setActive(null)}/>
    </div>
  );
  if (active === 'breathe') return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafa]">
      <BreatheGame onBack={() => setActive(null)}/>
    </div>
  );
  if (active === 'memory')  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafa]">
      <MemoryGame onBack={() => setActive(null)}/>
    </div>
  );
  if (active === 'doodle')  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafa]">
      <DoodleGame onBack={() => setActive(null)}/>
    </div>
  );

  return (
    <div className="min-h-screen relative selection:bg-teal-100 selection:text-teal-900 pt-32 pb-40 overflow-hidden bg-[#fafafa]">
      <Navbar />

      <div className="container mx-auto px-6 relative z-10">
        <header className="space-y-8 mb-20 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full harmonic-glass border-white/50 text-[10px] font-black uppercase tracking-[0.4em] text-teal-700 shadow-soft mx-auto">
                <Sparkles className="w-4 h-4 text-teal-500 animate-pulse" />
                Resonance Clinic: Clinical Entertainment v2.0
            </div>
            <h1 className="text-6xl lg:text-8xl font-serif font-black tracking-tighter text-slate-900 leading-tight italic">
                Neural <span className="text-aura-gradient not-italic">Entertainment.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Scientifically audited neuro-games designed to recalibrate cortisol levels and stabilize the parasympathetic rhythm.
            </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {GAMES.map(game => (
            <div 
              key={game.id} 
              onClick={() => setActive(game.id)} 
              className="group harmonic-glass-hover border-white p-10 space-y-8 cursor-pointer hover:scale-[1.03] active:scale-95 text-left transition-all"
            >
              <div className="w-20 h-20 rounded-[2.5rem] bg-white flex items-center justify-center shadow-inner border border-teal-50 group-hover:bg-teal-50 group-hover:scale-110 transition-all duration-500">
                <game.icon className={cn("w-10 h-10 transition-colors duration-500", game.color)} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <h3 className="font-serif text-3xl font-black text-slate-800 uppercase italic tracking-tighter group-hover:text-teal-600 transition-colors">{game.title}</h3>
                  <div className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-700 transition-all">{game.tag}</div>
                </div>
                <p className="text-base text-slate-500 font-medium leading-relaxed">{game.desc}</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-[0.3em]">
                Establish Neural Link <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 grid md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center opacity-50 px-10">
          {[
            { label: 'Phase I', title: 'Cortiol Suppression', icon: Target },
            { label: 'Phase II', title: 'Cognitive Recalibration', icon: Brain },
            { label: 'Phase III', title: 'Dopaminergic Harmony', icon: CheckCircle2 }
          ].map((stat, i) => (
            <div key={i} className="space-y-3">
              <stat.icon className="w-6 h-6 mx-auto text-slate-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
              <h4 className="font-serif text-lg font-black italic">{stat.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}