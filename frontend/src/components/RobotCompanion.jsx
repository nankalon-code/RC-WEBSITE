import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, Shield, Zap } from 'lucide-react';

export default function RobotCompanion() {
  const [bubbleText, setBubbleText] = useState("AI CORE: ONLINE");
  const [showBubble, setShowBubble] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const dialogs = [
    "DIAGNOSTICS: 100% OPTIMAL",
    "INITIATING OVERDRIVE PROTOCOLS...",
    "COFFEE LEVEL: CRITICAL",
    "HELLO HUMAN. READY TO BUILD?",
    "HACKING MAINFRAME... JUST KIDDING.",
    "SYSTEM TEMPERATURE: 34°C",
    "NEURAL DOCKING STABLE",
    "ROBOTICS CLUB CORE AT MAXIMUM POWER",
    "CURIOUS CURSOR DETECTED!",
    "BEEP BOOP! CODING COMMENCED."
  ];

  // Eye tracking cursor logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      
      // Calculate angle and limit distance to make eyes shift slightly
      const dist = Math.sqrt(relX * relX + relY * relY);
      const maxShift = 4; // Max SVG pixel shift
      const shiftX = dist > 0 ? (relX / dist) * Math.min(dist * 0.05, maxShift) : 0;
      const shiftY = dist > 0 ? (relY / dist) * Math.min(dist * 0.05, maxShift) : 0;
      
      setMousePos({ x: shiftX, y: shiftY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const triggerInteraction = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setBubbleText("CALIBRATING SENSORS...");
    setShowBubble(true);

    setTimeout(() => {
      const idx = Math.floor(Math.random() * dialogs.length);
      setBubbleText(dialogs[idx]);
      setIsProcessing(false);
    }, 1200);
  };

  useEffect(() => {
    // Periodically say random stuff
    const interval = setInterval(() => {
      if (!isProcessing && Math.random() > 0.4) {
        const idx = Math.floor(Math.random() * dialogs.length);
        setBubbleText(dialogs[idx]);
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 5000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div 
      ref={containerRef}
      onClick={triggerInteraction}
      className="relative w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center cursor-pointer select-none group"
    >
      {/* 1. Deep Futuristic Radar Wave Background */}
      <div className="absolute w-44 h-44 rounded-full bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-all duration-700 animate-pulse -z-10" />

      {/* Floating Dialog Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: -95, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute z-20 bg-base-var/90 border border-var rounded-2xl px-4 py-2 shadow-2xl backdrop-blur-md max-w-[200px] text-center"
          >
            {/* Small triangle arrow */}
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-base-var border-r border-b border-[var(--color-border)] rotate-45" />
            <p className="text-[10px] font-mono font-bold tracking-wider text-accent uppercase leading-tight">
              {bubbleText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Robotic Cyber Head (SVG Design) */}
      <motion.svg
        className="w-4/5 h-4/5 overflow-visible"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
      >
        {/* Holographic grid guidelines */}
        <circle cx="50" cy="50" r="46" stroke="var(--radar-stroke-4)" strokeWidth="0.5" strokeDasharray="3 9" />
        <ellipse cx="50" cy="50" rx="42" ry="15" stroke="var(--radar-stroke-4)" strokeWidth="0.5" className="opacity-40" />

        {/* Outer floating cyber rings */}
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          stroke="var(--radar-stroke-3)"
          strokeWidth="0.75"
          strokeDasharray="15 35"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />

        <motion.circle
          cx="50"
          cy="50"
          r="41"
          stroke="var(--radar-stroke-4)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* ROBOT CORE GRAPHIC */}
        {/* Ears / Antennas */}
        <line x1="26" y1="46" x2="16" y2="40" stroke="var(--radar-stroke-2)" strokeWidth="1" />
        <circle cx="16" cy="40" r="2" fill="var(--color-accent)" className="animate-pulse" />

        <line x1="74" y1="46" x2="84" y2="40" stroke="var(--radar-stroke-2)" strokeWidth="1" />
        <circle cx="84" cy="40" r="2" fill="var(--color-accent)" className="animate-pulse" />

        <motion.line
          x1="50" y1="28" x2="50" y2="18"
          stroke="var(--radar-stroke-1)" strokeWidth="1"
          animate={{ strokeWidth: isProcessing ? [1, 2, 1] : 1 }}
        />
        <motion.circle
          cx="50" cy="18" r="3"
          fill={isProcessing ? "var(--color-accent)" : "var(--radar-stroke-2)"}
          animate={{ scale: isProcessing ? [1, 1.4, 1] : [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Main Head Chassis */}
        <motion.rect
          x="28" y="32" width="44" height="34" rx="8"
          stroke={isProcessing ? "var(--color-accent)" : "var(--radar-stroke-1)"}
          strokeWidth="1.5"
          fill="var(--color-surface)"
          fillOpacity="0.4"
          animate={{ 
            strokeWidth: isProcessing ? 2.5 : 1.5,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Face Visor Glassmorphism Area */}
        <rect
          x="32" y="38" width="36" height="18" rx="4"
          stroke="var(--radar-stroke-3)"
          strokeWidth="1"
          fill="var(--color-base)"
          fillOpacity="0.9"
        />

        {/* Dynamic Glowing Follow Eyes */}
        <g>
          {/* Left Eye Socket */}
          <circle cx="42" cy="47" r="5" stroke="var(--radar-stroke-3)" strokeWidth="0.5" />
          {/* Left pupil moving with cursor coordinates */}
          <motion.circle
            cx={42 + mousePos.x}
            cy={47 + mousePos.y}
            r={isProcessing ? 1.5 : 2.5}
            fill="var(--color-accent)"
            animate={{ 
              scale: isProcessing ? [1, 1.6, 1] : 1,
              fill: isProcessing ? "#ffffff" : "var(--color-accent)"
            }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />

          {/* Right Eye Socket */}
          <circle cx="58" cy="47" r="5" stroke="var(--radar-stroke-3)" strokeWidth="0.5" />
          {/* Right pupil moving with cursor coordinates */}
          <motion.circle
            cx={58 + mousePos.x}
            cy={47 + mousePos.y}
            r={isProcessing ? 1.5 : 2.5}
            fill="var(--color-accent)"
            animate={{ 
              scale: isProcessing ? [1, 1.6, 1] : 1,
              fill: isProcessing ? "#ffffff" : "var(--color-accent)"
            }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
        </g>

        {/* Mouth Audio Visualizer / Grid */}
        <motion.path
          d={isProcessing 
            ? "M40 60 Q 45 56, 50 60 Q 55 64, 60 60" 
            : "M40 60 L 60 60"
          }
          stroke="var(--radar-stroke-2)"
          strokeWidth="1"
          animate={{
            d: isProcessing 
              ? ["M40 60 Q 45 56, 50 60 Q 55 64, 60 60", "M40 60 Q 45 64, 50 60 Q 55 56, 60 60", "M40 60 Q 45 56, 50 60 Q 55 64, 60 60"]
              : "M40 60 L 60 60"
          }}
          transition={{ repeat: Infinity, duration: 0.4 }}
        />

        {/* Under-chin neck block */}
        <rect x="45" y="66" width="10" height="6" fill="var(--radar-stroke-4)" stroke="var(--radar-stroke-3)" strokeWidth="0.5" />

        {/* Floating tech nodes surrounding */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        >
          {/* Data coordinates */}
          <circle cx="20" cy="20" r="1.5" fill="var(--color-accent)" className="opacity-60" />
          <circle cx="80" cy="80" r="1" fill="var(--radar-stroke-2)" />
          <circle cx="15" cy="75" r="2" fill="var(--radar-stroke-3)" />
        </motion.g>
      </motion.svg>

      {/* Touch to Diagnostics prompt */}
      <span className="text-[9px] font-mono text-muted-var opacity-40 uppercase tracking-widest mt-2 group-hover:opacity-100 group-hover:text-accent transition-all">
        {isProcessing ? "ANALYZING..." : "CLICK TO DIAGNOSE"}
      </span>
    </div>
  );
}
