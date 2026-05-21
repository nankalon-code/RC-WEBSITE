import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) {
  const variants = {
    primary: "bg-[var(--color-primary)] text-[var(--color-base)] font-bold shadow-[0_0_30px_var(--color-glow)] hover:shadow-[0_0_40px_var(--color-glow-strong)]",
    secondary: "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] border border-[var(--color-border)]",
    outline: "border border-[var(--color-border-hover)] text-[var(--color-text-main)] hover:bg-[var(--glass-bg-hover)] hover:border-[var(--color-border-hover)]",
    ghost: "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--glass-bg)]",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl",
  };

  return (
    <motion.button 
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 0, scale: 0.98 }}
      className={cn(
        "transition-all duration-300 flex items-center justify-center font-medium tracking-wide relative overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-[var(--color-base)]/20 to-transparent animate-shimmer" />
        </div>
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
