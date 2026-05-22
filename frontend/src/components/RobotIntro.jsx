import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Wifi, SkipForward } from 'lucide-react';

export default function RobotIntro() {
  const [isDismissed, setIsDismissed] = useState(true);
  const [logs, setLogs] = useState([]);
  const [bootState, setBootState] = useState('booting');

  const LOGS = ['MOTOR ARRAY OK', 'SENSORS ONLINE', 'AI CORE READY', 'LAUNCHING...'];

  const dismiss = () => {
    setBootState('collapsing');
    sessionStorage.setItem('robot_boot_done', '1');
    setTimeout(() => setIsDismissed(true), 550);
  };

  useEffect(() => {
    if (sessionStorage.getItem('robot_boot_done')) return;
    setIsDismissed(false);
    let i = 0;
    const t = setInterval(() => {
      if (i < LOGS.length) { setLogs(p => [...p, LOGS[i++]]); }
      else { clearInterval(t); setBootState('ready'); }
    }, 800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (bootState !== 'ready') return;
    const t = setTimeout(dismiss, 2400);
    return () => clearTimeout(t);
  }, [bootState]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {bootState !== 'collapsing' && (
        <motion.div
          initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono select-none"
        >
          {/* grid bg */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* top bar */}
          <div className="absolute top-5 left-6 flex gap-5 text-[9px] tracking-widest text-white/20 uppercase">
            <span className="flex items-center gap-1"><ShieldAlert size={9} /> SECURE</span>
            <span className="flex items-center gap-1"><Wifi size={9} /> ONLINE</span>
          </div>

          {/* skip */}
          <button onClick={dismiss}
            className="absolute top-5 right-6 flex items-center gap-1 text-[9px] tracking-widest uppercase text-white/20 hover:text-white/60 transition-colors">
            SKIP <SkipForward size={9} />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-[340px] px-8 py-10 rounded-3xl border border-white/[0.08] bg-black/85 backdrop-blur-2xl text-center shadow-2xl flex flex-col items-center gap-8 glass-card"
          >
            {/* Tech Elements */}
            <div className="absolute top-4 left-5 text-[8px] font-mono tracking-[0.25em] text-white/35 uppercase flex items-center gap-1.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM CORE INIT
            </div>

            {/* robot */}
            <div className="relative w-44 h-44 flex items-center justify-center mt-2">
              <div className="absolute w-40 h-40 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 70%)' }} />
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" fill="none">
                <motion.circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.75" strokeDasharray="8 16"
                  animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }} />
                <motion.circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5" strokeDasharray="4 8"
                  animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }} />
              </svg>
              <motion.img src="/new_robot.png" alt="Robot"
                className="w-40 h-40 object-contain z-10 pointer-events-none filter drop-shadow-[0_12px_30px_rgba(96,165,250,0.3)]"
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />

              <AnimatePresence>
                {bootState === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: -64 }}
                    exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="absolute z-20 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md text-center"
                    style={{ background: 'rgba(0,0,0,0.85)' }}
                  >
                    <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-white/10"
                      style={{ background: '#000' }} />
                    <p className="text-[10px] font-bold tracking-[0.18em] text-white/90 uppercase">Hi! Let's build.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* logs */}
            <div className="w-full space-y-2 text-left font-mono border-t border-white/[0.05] pt-5">
              {logs.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }} className="flex items-center gap-2 text-[10px] tracking-widest uppercase">
                  <span className="text-white/20">›</span>
                  <span className={i === LOGS.length - 1 && bootState === 'ready' ? 'text-white font-bold' : 'text-white/40'}>{l}</span>
                  {i === LOGS.length - 1 && bootState === 'ready' && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400 text-[10px] font-bold">✓</motion.span>
                  )}
                </motion.div>
              ))}
              {bootState === 'booting' && (
                <div className="flex gap-1.5 pl-4 mt-2">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30"
                      animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }} />
                  ))}
                </div>
              )}
            </div>

            {/* progress bar */}
            <div className="w-full h-1 bg-white/[0.04] overflow-hidden rounded-full mt-2">
              <motion.div className="h-full bg-white/80 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" initial={{ width: '0%' }}
                animate={{ width: `${(logs.length / LOGS.length) * 100}%` }} transition={{ duration: 0.2 }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
