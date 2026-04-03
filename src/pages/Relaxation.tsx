import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import AnimatedBot from '@/components/AnimatedBot';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wind,
  Waves,
  Cloud,
  Music as MusicIcon,
  Heart,
  Bird,
  Droplets,
  ArrowLeft,
} from 'lucide-react';

const Relaxation = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sounds = [
    {
      id: 'rain',
      name: 'Rain Sounds',
      icon: Droplets,
      description: 'Gentle rainfall for deep relaxation',
      color: 'bg-blue-500',
      url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      icon: Waves,
      description: 'Calming waves of the sea',
      color: 'bg-cyan-500',
      url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3',
    },
    {
      id: 'wind',
      name: 'Forest Wind',
      icon: Wind,
      description: 'Peaceful wind through trees',
      color: 'bg-green-500',
      url: 'https://assets.mixkit.co/active_storage/sfx/2398/2398-preview.mp3',
    },
    {
      id: 'birds',
      name: 'Birds Chirping',
      icon: Bird,
      description: 'Morning birds in nature',
      color: 'bg-yellow-500',
      url: 'https://assets.mixkit.co/active_storage/sfx/1950/1950-preview.mp3',
    },
    {
      id: 'meditation',
      name: 'Meditation Music',
      icon: MusicIcon,
      description: 'Soft instrumental music',
      color: 'bg-purple-500',
      url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    },
    {
      id: 'thunder',
      name: 'Distant Thunder',
      icon: Cloud,
      description: 'Thunder in the distance',
      color: 'bg-gray-500',
      url: 'https://assets.mixkit.co/active_storage/sfx/2392/2392-preview.mp3',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const playSound = (sound: typeof sounds[0]) => {
    if (currentSound === sound.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(sound.url);
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume;
      audioRef.current = audio;
      
      audio.play().then(() => {
        setIsPlaying(true);
        setCurrentSound(sound.id);
      }).catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const breathingCycle = () => {
      switch (breathPhase) {
        case 'inhale':
          timer = setTimeout(() => setBreathPhase('hold'), 4000);
          break;
        case 'hold':
          timer = setTimeout(() => setBreathPhase('exhale'), 4000);
          break;
        case 'exhale':
          timer = setTimeout(() => {
            setBreathPhase('rest');
            setBreathCount(prev => prev + 1);
          }, 4000);
          break;
        case 'rest':
          timer = setTimeout(() => setBreathPhase('inhale'), 2000);
          break;
      }
    };

    breathingCycle();
    return () => clearTimeout(timer);
  }, [breathPhase]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <section className="text-center mb-12 fade-in-up">
          <div className="flex justify-center mb-4">
            <AnimatedBot size="lg" mood="empathetic" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Relax & Unwind
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a moment to breathe deeply and let the calming sounds wash over you.
          </p>
        </section>

        <section className="mb-12">
          <Card variant="glass" className="mb-6">
            <CardHeader>
              <CardTitle>Choose Your Ambiance</CardTitle>
              <CardDescription>Select a sound to create your peaceful environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sounds.map((sound, index) => (
                  <Card
                    key={sound.id}
                    variant="interactive"
                    className={`cursor-pointer transition-all ${
                      currentSound === sound.id && isPlaying ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => playSound(sound)}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-16 h-16 rounded-2xl ${sound.color} flex items-center justify-center mb-4 mx-auto shadow-lg`}
                      >
                        <sound.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground text-center mb-2">
                        {sound.name}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {sound.description}
                      </p>
                      <Button
                        variant={currentSound === sound.id && isPlaying ? 'default' : 'outline'}
                        className="w-full gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound(sound);
                        }}
                      >
                        {currentSound === sound.id && isPlaying ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {isPlaying && (
            <Card variant="glass" className="fade-in-up">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="shrink-0"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-muted-foreground shrink-0 w-12 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <Card variant="gradient" className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Guided Breathing Exercise
              </CardTitle>
              <CardDescription>Follow the circle to regulate your breathing</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-8">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div
                    className={`absolute w-full h-full rounded-full border-4 transition-all duration-1000 ${
                      breathPhase === 'inhale'
                        ? 'scale-100 border-blue-500 bg-blue-500/20'
                        : breathPhase === 'hold'
                        ? 'scale-100 border-purple-500 bg-purple-500/20'
                        : breathPhase === 'exhale'
                        ? 'scale-50 border-green-500 bg-green-500/20'
                        : 'scale-75 border-gray-500 bg-gray-500/20'
                    }`}
                    style={{
                      transitionDuration:
                        breathPhase === 'rest' ? '2s' : breathPhase === 'inhale' ? '4s' : '4s',
                    }}
                  />
                  <div className="relative z-10 text-center">
                    <p className="text-2xl font-bold text-foreground capitalize mb-2">
                      {breathPhase}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {breathPhase === 'inhale' && 'Breathe in slowly...'}
                      {breathPhase === 'hold' && 'Hold your breath...'}
                      {breathPhase === 'exhale' && 'Breathe out slowly...'}
                      {breathPhase === 'rest' && 'Rest and prepare...'}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Breathing cycles completed</p>
                  <p className="text-4xl font-bold text-primary">{breathCount}</p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setBreathCount(0);
                    setBreathPhase('inhale');
                  }}
                >
                  Reset Counter
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card variant="calm" className="mt-8 fade-in-up">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Relaxation Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Find a comfortable, quiet space where you won't be disturbed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Close your eyes and focus on the sound and your breathing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Practice for at least 5-10 minutes for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Regular practice can help reduce stress and improve sleep quality</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default Relaxation;