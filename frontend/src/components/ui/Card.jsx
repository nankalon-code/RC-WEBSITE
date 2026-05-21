import { useState, useRef } from "react";
import { cn } from "../../utils/cn";

export function Card({ children, className, hover = true, glow = false, ...props }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-500 group",
        hover && "glass-card-hover hover:-translate-y-1",
        glow && "glow-soft",
        className
      )}
      {...props}
    >
      {/* Tactile Hover Laser Scan Spotlight Overlay (strictly monochromatic subtle silver at 5.5% opacity max) */}
      <div 
        className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-500 z-0" 
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.055), transparent 80%)`
        }}
      />

      {/* 📐 Dynamic Corner-Clamp HUD Brackets (slides inward to lock-in the corners on hover) */}
      <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t-[1.5px] border-l-[1.5px] border-white/0 pointer-events-none transition-all duration-500 group-hover:top-3 group-hover:left-3 group-hover:border-white/25 z-20" />
      <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t-[1.5px] border-r-[1.5px] border-white/0 pointer-events-none transition-all duration-500 group-hover:top-3 group-hover:right-3 group-hover:border-white/25 z-20" />
      <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b-[1.5px] border-l-[1.5px] border-white/0 pointer-events-none transition-all duration-500 group-hover:bottom-3 group-hover:left-3 group-hover:border-white/25 z-20" />
      <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b-[1.5px] border-r-[1.5px] border-white/0 pointer-events-none transition-all duration-500 group-hover:bottom-3 group-hover:right-3 group-hover:border-white/25 z-20" />

      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border-hover)] to-transparent opacity-60 z-10" />
      
      {/* Children Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
