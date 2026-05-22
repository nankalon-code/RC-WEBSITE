import { motion } from 'framer-motion';

export default function TechGyroscope() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center pointer-events-none select-none">
      {/* 1. Deep background ambient adaptive glow (Very faint) */}
      <div className="absolute w-48 h-48 rounded-full bg-[var(--radar-stroke-4)] blur-3xl animate-pulse" />

      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 2. Outer Orbit Guideline */}
        <circle cx="50" cy="50" r="42" stroke="var(--radar-stroke-4)" strokeWidth="0.5" />

        {/* 3. Rotating Tech Rings (Concentric outer) */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="var(--radar-stroke-3)"
          strokeWidth="0.75"
          strokeDasharray="10 30"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />

        <motion.circle
          cx="50"
          cy="50"
          r="38"
          stroke="var(--radar-stroke-4)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* 4. Giant Tilted Monochromatic Outer Ring */}
        <motion.ellipse
          cx="50"
          cy="50"
          initial={{ rx: 44, ry: 12 }}
          animate={{ 
            rotate: [15, 20, 15],
            ry: [12, 16, 12]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '50px 50px' }}
          stroke="var(--radar-stroke-1)"
          strokeWidth="1.2"
        />

        {/* 5. Giant Tilted Monochromatic Inner Ring */}
        <motion.ellipse
          cx="50"
          cy="50"
          initial={{ rx: 10, ry: 44 }}
          animate={{ 
            rotate: [-15, -10, -15],
            rx: [10, 14, 10]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ transformOrigin: '50px 50px' }}
          stroke="var(--radar-stroke-2)"
          strokeWidth="0.8"
        />

        {/* 6. Central Rotating Wireframe Globe */}
        <g style={{ transformOrigin: '50px 50px' }}>
          {/* Globe core outline */}
          <circle cx="50" cy="50" r="22" stroke="var(--radar-stroke-3)" strokeWidth="0.75" />
          
          {/* Rotating Latitude/Longitude rings */}
          <motion.ellipse
            cx="50"
            cy="50"
            initial={{ rx: 22, ry: 6 }}
            animate={{ ry: [6, 22, 6] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '50px 50px' }}
            stroke="var(--radar-stroke-2)"
            strokeWidth="0.5"
          />

          <motion.ellipse
            cx="50"
            cy="50"
            initial={{ rx: 6, ry: 22 }}
            animate={{ rx: [6, 22, 6] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '50px 50px' }}
            stroke="var(--radar-stroke-2)"
            strokeWidth="0.5"
          />

          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '50px 50px' }}
          >
            {/* Fine globe mesh ticks */}
            <line x1="50" y1="28" x2="50" y2="72" stroke="var(--radar-stroke-3)" strokeWidth="0.5" />
            <line x1="28" y1="50" x2="72" y2="50" stroke="var(--radar-stroke-3)" strokeWidth="0.5" />
          </motion.g>
        </g>

        {/* 7. Fine floating coordinates (satellites) */}
        <motion.circle
          cx="82"
          cy="30"
          r="1.5"
          fill="var(--radar-fill)"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="22"
          cy="72"
          r="1.2"
          fill="var(--radar-fill)"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
