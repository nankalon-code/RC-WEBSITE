import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { apiFetch } from '../utils/api';
import { Image, X, ChevronLeft, ChevronRight, Eye, Grid } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useEffect(() => {
    apiFetch('/gallery')
      .then((data) => {
        setPhotos(data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const openLightbox = (index) => {
    setSelectedIdx(index);
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 18 }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative z-10 text-primary-var">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-[-10%] left-0 w-[35rem] h-[35rem] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-float-reverse" />

      {/* Header Panel */}
      <div className="text-center mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-var bg-surface-var/60 mb-4 backdrop-blur-sm"
        >
          <Grid size={13} className="text-accent animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono">Visual Chronicles</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase leading-none"
        >
          CLUB <span className="text-muted-var">GALLERY</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-muted-var text-md max-w-lg mx-auto font-light mt-4 leading-relaxed"
        >
          A curated perspective inside our robotics labs, prototype testing, competition floor, and dynamic team building sessions.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 rounded-full border-2 border-primary-var border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-mono text-muted-var tracking-widest uppercase animate-pulse">Initializing Media...</p>
        </div>
      ) : photos.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {photos.map((photo, idx) => (
            <motion.div key={photo.id} variants={itemVariants}>
              <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.02} transitionSpeed={2500} className="h-full">
                <Card 
                  onClick={() => openLightbox(idx)}
                  className="group relative h-72 rounded-2xl overflow-hidden border border-var bg-glass-bg select-none cursor-pointer flex flex-col justify-end"
                >
                  <img 
                    src={photo.image_url} 
                    alt={photo.caption} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-var/90 via-base-var/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Floating Action Eye Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-base-var/80 border border-var text-accent shadow-xl backdrop-blur-md">
                      <Eye size={16} className="animate-pulse" />
                    </div>
                  </div>

                  {/* Caption & Overlay Detail */}
                  <div className="relative p-5 z-10">
                    <h3 className="font-bold text-sm text-primary-var tracking-wide truncate group-hover:text-accent transition-colors">
                      {photo.caption || `Photo #${photo.id}`}
                    </h3>
                    {photo.description && (
                      <p className="text-[11px] text-muted-var line-clamp-1 opacity-70 mt-1">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 border border-dashed border-var rounded-3xl bg-glass-bg backdrop-blur-sm max-w-md mx-auto">
          <Image size={40} className="mx-auto text-muted-var opacity-40 mb-4" />
          <p className="text-muted-var font-light">Gallery is empty.</p>
        </div>
      )}

      {/* Cinematic Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8"
          >
            {/* Top Bar Details */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-white z-20 pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-widest uppercase text-white/50">LIGHTBOX COMPANION</span>
                <span className="text-sm font-bold tracking-wide mt-1">
                  {photos[selectedIdx]?.caption || `Photo #${photos[selectedIdx]?.id}`}
                </span>
              </div>
              <button 
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 hover:bg-white/5 pointer-events-auto transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Left/Right Buttons */}
            <button 
              onClick={prevPhoto}
              className="absolute left-4 w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 hover:bg-white/5 text-white z-20 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={nextPhoto}
              className="absolute right-4 w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 hover:bg-white/5 text-white z-20 transition-all"
            >
              <ChevronRight size={20} />
            </button>

            {/* Center Image and details container */}
            <div className="relative max-w-5xl max-h-[75vh] flex flex-col items-center justify-center pointer-events-none">
              <motion.img 
                key={selectedIdx}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                src={photos[selectedIdx]?.image_url} 
                alt={photos[selectedIdx]?.caption} 
                className="max-w-full max-h-[65vh] object-contain rounded-2xl border border-white/10 shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Bottom details box */}
              {photos[selectedIdx]?.description && (
                <motion.div 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 max-w-xl text-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs text-white/80 font-light leading-relaxed">
                    {photos[selectedIdx]?.description}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Photo Index Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-mono pointer-events-none">
              INDEX: {selectedIdx + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
