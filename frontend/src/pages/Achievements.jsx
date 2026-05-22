import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { apiFetch } from '../utils/api';
import { Trophy, Calendar, Cpu, Award } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/achievements')
      .then((data) => {
        setAchievements(data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative z-10 text-primary-var">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-float-reverse" />

      {/* Header Panel */}
      <div className="text-center mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-var bg-surface-var/60 mb-4 backdrop-blur-sm"
        >
          <Trophy size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono">Championships & Triumphs</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase leading-none"
        >
          OUR <span className="text-muted-var">ACHIEVEMENTS</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-muted-var text-md max-w-lg mx-auto font-light mt-4 leading-relaxed"
        >
          A timeline of hardware prototypes, software solutions, and brilliant team performances winning awards on global stages.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 rounded-full border-2 border-primary-var border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-mono text-muted-var tracking-widest uppercase animate-pulse">Retrieving Triumphs...</p>
        </div>
      ) : achievements.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {achievements.map((ach) => (
            <motion.div key={ach.id} variants={itemVariants}>
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={2000}>
                <Card glow className="relative flex flex-col h-full border-var bg-glass-bg overflow-hidden rounded-3xl group">
                  
                  {/* Image Container with Full Bleed */}
                  {ach.image_url ? (
                    <div className="relative h-64 sm:h-72 overflow-hidden border-b border-var">
                      <img 
                        src={ach.image_url} 
                        alt={ach.project_name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-base-var via-base-var/30 to-transparent opacity-80" />
                      
                      {/* Top Ribbon Badge */}
                      {ach.award_place && (
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/40 bg-base-var/80 text-accent text-xs font-mono font-bold backdrop-blur-md shadow-lg">
                          <Award size={12} />
                          {ach.award_place}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-20 bg-gradient-to-r from-accent/10 to-primary/10 border-b border-var relative flex items-center px-6">
                      {ach.award_place && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/40 bg-base-var/80 text-accent text-xs font-mono font-bold backdrop-blur-md">
                          <Award size={12} />
                          {ach.award_place}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Category and Date row */}
                      <div className="flex items-center gap-4 text-xs font-mono text-muted-var mb-3">
                        {ach.category && (
                          <span className="flex items-center gap-1">
                            <Cpu size={12} className="text-accent" />
                            {ach.category}
                          </span>
                        )}
                        {ach.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>

                      {/* Main Title & Associated Project */}
                      <h3 className="text-xl font-bold font-display text-primary-var leading-snug group-hover:text-accent transition-colors mb-2">
                        {ach.title}
                      </h3>
                      {ach.project_name && (
                        <p className="text-sm font-bold tracking-wide text-muted-var mb-4 uppercase">
                          Project: <span className="text-primary-var font-normal">{ach.project_name}</span>
                        </p>
                      )}

                      {/* Detailed Description */}
                      <p className="text-sm leading-relaxed text-muted-var font-light opacity-90 line-clamp-4">
                        {ach.description}
                      </p>
                    </div>

                    <div className="w-full h-[1px] bg-var my-6" />
                    
                    <div className="flex items-center justify-between text-xs font-mono text-muted-var">
                      <span className="uppercase tracking-widest font-bold">Official Trophy Record</span>
                      <span className="opacity-40">REF_ID: #{ach.id}</span>
                    </div>
                  </div>
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 border border-dashed border-var rounded-3xl bg-glass-bg backdrop-blur-sm max-w-md mx-auto">
          <Trophy size={40} className="mx-auto text-muted-var opacity-40 mb-4" />
          <p className="text-muted-var font-light">No achievements registered yet.</p>
        </div>
      )}
    </div>
  );
}
