import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function LabStatusHUD() {
  const [collapsed, setCollapsed] = useState(false);
  const [readings, setReadings] = useState({ temp: '47.2°C', ping: '12ms', uptime: '00:00:00', rate: '218/s' });
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      setReadings({
        temp: `${(44 + Math.random() * 8).toFixed(1)}°C`,
        ping: `${Math.floor(8 + Math.random() * 18)}ms`,
        uptime: `${h}:${m}:${s}`,
        rate: `${Math.floor(200 + Math.random() * 60)}/s`,
      });
    }, 2000);
    return () => clearInterval(t);
  }, [startTime]);

  const rows = [
    { label: 'CPU TEMP', val: readings.temp },
    { label: 'NET PING', val: readings.ping },
    { label: 'SESSION', val: readings.uptime },
    { label: 'DATA RATE', val: readings.rate },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-40 font-mono text-[10px] tracking-widest select-none"
    >
      <div
        className="rounded-xl overflow-hidden cursor-pointer border border-white/[0.07] backdrop-blur-xl"
        style={{ background: 'rgba(0,0,0,0.82)' }}
        onClick={() => setCollapsed(c => !c)}
      >
        {/* header */}
        <div className="flex items-center justify-between px-3 py-2 gap-5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 5px #34d399' }} />
            <span className="text-white/55 uppercase">LAB ONLINE</span>
          </div>
          <ChevronDown size={8} className={`text-white/25 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </div>

        {/* readings */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="readings"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="border-t border-white/[0.05]"
            >
              {rows.map(({ label, val }) => (
                <div key={label} className="flex justify-between items-center px-3 py-1.5 gap-8">
                  <span className="text-white/25">{label}</span>
                  <motion.span key={val} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }} className="text-white/60 tabular-nums">
                    {val}
                  </motion.span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
