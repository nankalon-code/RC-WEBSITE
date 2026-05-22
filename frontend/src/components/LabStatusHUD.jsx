import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function LabStatusHUD() {
  const [collapsed, setCollapsed] = useState(false);
  const [readings, setReadings] = useState({ temp: '24.2°C', members: '4 ACTIVE', power: '1.42 kW', bots: '2 ONLINE' });
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      setReadings({
        temp: `${(23.5 + Math.random() * 1.2).toFixed(1)}°C`,
        members: `${Math.floor(3 + Math.random() * 3)} ACTIVE`,
        power: `${(1.35 + Math.random() * 0.18).toFixed(2)} kW`,
        bots: `${Math.floor(1 + Math.random() * 2)} ONLINE`,
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const rows = [
    { label: 'LAB TEMP', val: readings.temp },
    { label: 'MEMBERS', val: readings.members },
    { label: 'POWER DRAW', val: readings.power },
    { label: 'ACTIVE BOTS', val: readings.bots },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-40 font-mono text-[10px] tracking-widest select-none"
    >
      <div
        className="rounded-xl overflow-hidden cursor-pointer border border-white/20 backdrop-blur-3xl shadow-[0_0_30px_rgba(255,255,255,0.03),_inset_0_0_12px_rgba(255,255,255,0.02)]"
        style={{ background: 'rgba(0,0,0,0.92)' }}
        onClick={() => setCollapsed(c => !c)}
      >
        {/* header */}
        <div className="flex items-center justify-between px-3 py-2 gap-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px #34d399' }} />
            <span className="text-white font-bold uppercase tracking-[0.18em]">LAB ONLINE</span>
          </div>
          <ChevronDown size={9} className={`text-white/40 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </div>

        {/* readings */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="readings"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            >
              {rows.map(({ label, val }) => (
                <div key={label} className="flex justify-between items-center px-3 py-2 gap-8 border-b border-white/[0.02] last:border-none">
                  <span className="text-white/40 font-medium">{label}</span>
                  <motion.span key={val} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }} className="text-white font-bold tabular-nums">
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
