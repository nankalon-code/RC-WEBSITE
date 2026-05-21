import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GlassBubbles() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce bubble count from 15 to only 5 on mobile viewports to prevent screen clutter
  const bubbleCount = isMobile ? 5 : 15;

  const bubbles = Array.from({ length: bubbleCount }).map((_, i) => {
    const size = Math.random() * 90 + 40; // 40px to 130px
    let startX = Math.random() * 95 + 2.5; // Spread across the entire canvas
    let startY = Math.random() * 90 + 5;
    
    // TechGyroscope Radar Region: x > 52% and y between 20% and 72%
    // Allows bubbles to float beautifully in the top-right corner (shown in user's image) and the bottom-right corner!
    if (startX > 52 && startY >= 20 && startY <= 72) {
      // Relocate bubble dynamically to preserve visual balance all over the screen
      if (Math.random() > 0.5) {
        startX -= 45; // Push to the left half
      } else if (startY > 46) {
        startY = Math.min(startY + 20, 95); // Push downwards safely
      } else {
        startY = Math.max(startY - 18, 5); // Push upwards safely
      }
    }

    const duration = Math.random() * 25 + 25; // Slower float (25s to 50s)
    
    return {
      id: i,
      size,
      startX,
      startY,
      duration,
      delay: Math.random() * 12,
    };
  });


  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle tech grid behind bubbles */}
      <div className="absolute inset-0 tech-grid opacity-20" />

      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full animate-bubble glass-bubble-sphere"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.startX}%`,
            top: `${bubble.startY}%`,
          }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: [0, -60, 30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 90, 180, 360],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Theme-adaptive glass reflections */}
          <div className="glass-bubble-highlight-top" />
          <div className="glass-bubble-highlight-bottom" />
        </motion.div>
      ))}
    </div>
  );
}
