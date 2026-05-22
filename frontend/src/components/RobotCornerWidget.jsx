import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
  'We meet every Friday at the lab.',
  '50+ projects to choose from.',
  'Hardware or software — you pick.',
  'Join the forum to lock your project.',
  'Open to all branches and years.',
];

export default function RobotCornerWidget() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    if (!hovered) return;
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 3000);
    return () => clearInterval(t);
  }, [hovered]);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => setClicked(false), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 4, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center"
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 6 }}
            transition={{ duration: 0.18 }}
            className="mb-3 px-3 py-2.5 rounded-xl border border-white/[0.08] backdrop-blur-xl font-mono text-[10px] tracking-wide text-white/65 max-w-[170px] text-center relative"
            style={{ background: 'rgba(0,0,0,0.88)' }}
          >
            <AnimatePresence mode="wait">
              <motion.span key={tipIdx}
                initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }}
                className="block"
              >
                {TIPS[tipIdx]}
              </motion.span>
            </AnimatePresence>
            {/* triangle */}
            <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-white/[0.08]"
              style={{ background: 'rgba(0,0,0,0.88)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot */}
      <motion.div
        className="cursor-pointer"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={handleClick}
        animate={
          clicked
            ? { rotate: [0, -12, 12, -10, 10, 0], scale: [1, 1.15, 1.15, 1.15, 1.15, 1] }
            : { y: [0, -7, 0] }
        }
        transition={
          clicked
            ? { duration: 0.6, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
        }
      >
        <img
          src="/new_robot.png"
          alt="Robot mascot"
          className="w-14 h-14 object-contain select-none"
          style={{ filter: 'drop-shadow(0 4px 18px rgba(96,165,250,0.3))' }}
        />
      </motion.div>
    </motion.div>
  );
}
