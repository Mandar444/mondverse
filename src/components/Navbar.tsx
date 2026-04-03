import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Brain,
  Home,
  MessageCircle,
  Activity,
  Gamepad2,
  Music,
  User,
  LogOut,
  Settings,
  Shield,
  Stethoscope,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  userRole?: 'user' | 'psychiatrist' | 'admin' | null;
  onLogout?: () => void;
}

const Navbar = ({ userRole, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const userLinks = [
    { path: '/dashboard', label: 'Sanctuary', icon: Home },
    { path: '/chat', label: 'Dr. Mind', icon: MessageCircle },
    { path: '/stress', label: 'Rhythm', icon: Activity },
    { path: '/exercises', label: 'Focus', icon: Gamepad2 },
    { path: '/music', label: 'Ambience', icon: Music },
  ];

  const psychiatristLinks = [
    { path: '/psychiatrist', label: 'Clinical Center', icon: Home },
    { path: '/psychiatrist/patients', label: 'Patient Care', icon: User },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Nexus Hub', icon: Shield },
    { path: '/admin/users', label: 'Node Authority', icon: User },
    { path: '/admin/settings', label: 'Global Setup', icon: Settings },
  ];

  const getLinks = () => {
    switch (userRole) {
      case 'psychiatrist': return psychiatristLinks;
      case 'admin': return adminLinks;
      default: return userLinks;
    }
  };

  const links = getLinks();

  return (
    <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700",
        scrolled ? "py-4 px-6" : "py-8 px-6"
    )}>
      <div className={cn(
          "container mx-auto transition-all duration-500",
          scrolled ? "harmonic-glass-hover bg-white/80 border-white/80 h-20 px-8" : "bg-transparent border-transparent h-12"
      )}>
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to={userRole ? (userRole === 'admin' ? '/admin' : userRole === 'psychiatrist' ? '/psychiatrist' : '/dashboard') : '/'} 
                className="flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-tighter text-slate-800 leading-none">
                MindBridge
              </span>
              {userRole && (
                <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg mt-1 text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm",
                    userRole === 'admin' ? "bg-sky-50 text-sky-600 border-sky-100" : 
                    userRole === 'psychiatrist' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                    "bg-teal-50 text-teal-600 border-teal-100"
                )}>
                    <Sparkles className="w-2 h-2" />
                    {userRole === 'admin' ? 'Nexus' : userRole === 'psychiatrist' ? 'Clinical' : 'Harmony'} Node
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          {userRole && (
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-3xl bg-white/30 backdrop-blur-md border border-white/50 shadow-inner">
              {links.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'gap-2 rounded-[1.25rem] h-10 px-6 font-bold transition-all duration-500',
                      isActive(link.path) 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-teal-600 hover:bg-white/60'
                    )}
                  >
                    <link.icon className={cn("w-4 h-4", isActive(link.path) ? "text-white" : "text-teal-500")} />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {userRole ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hidden md:flex gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl h-11 px-6 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-teal-600 cursor-pointer transition-colors">Sign In</span>
                </Link>
                <Link to="/login">
                  <Button className="btn-aura h-12 px-8 text-xs">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden rounded-2xl w-12 h-12 border-white bg-white/50 backdrop-blur-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5 text-teal-600" /> : <Menu className="w-5 h-5 text-teal-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden fixed inset-x-0 top-24 mx-6 p-8 harmonic-glass-hover border-white/80 animate-fade-in shadow-2xl">
            <div className="flex flex-col gap-4">
              {userRole ? (
                <>
                  {links.map((link) => (
                    <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-4 h-16 px-6 rounded-[1.5rem] font-bold text-lg",
                            isActive(link.path) 
                                ? "bg-teal-50 text-teal-700 border border-teal-100" 
                                : "text-slate-500"
                        )}
                      >
                        <link.icon className="w-6 h-6 text-teal-500" />
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  <div className="h-px bg-teal-50 my-2" />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsOpen(false);
                      onLogout?.();
                    }}
                    className="w-full justify-start gap-4 h-16 px-6 rounded-[1.5rem] font-black text-rose-500 uppercase tracking-widest text-xs"
                  >
                    <LogOut className="w-6 h-6" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="grid gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-16 rounded-[1.5rem] font-bold border-teal-50 bg-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="btn-aura w-full h-16 text-lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
