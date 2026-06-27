import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const staticPhotos = [
    { label: 'IMG_01', caption: 'MANIPULATOR DRY-FIT', image_url: '/robot_chassis_wireframe.png' },
    { label: 'IMG_04', caption: 'DRONE BUILD, DAY 1', image_url: '/robot_chassis_wireframe.png' },
    { label: 'IMG_07', caption: 'HEXAPOD GAIT TUNING', image_url: '/robot_chassis_wireframe.png' },
    { label: 'IMG_02', caption: 'CRAWLER MK.III FIELD TEST', image_url: '/robot_chassis_wireframe.png' },
    { label: 'IMG_05', caption: 'PCB REV. 04', image_url: '/robot_chassis_wireframe.png' },
    { label: 'IMG_08', caption: 'VISION RIG ASSEMBLY', image_url: '/robot_chassis_wireframe.png' }
  ];

  const displayPhotos = photos.length > 0
    ? photos.map((p, idx) => ({
        label: `IMG_${String(idx + 1).padStart(2, '0')}`,
        caption: p.caption ? p.caption.toUpperCase() : `PHOTO RECORD`,
        image_url: p.image_url
      }))
    : staticPhotos;

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % displayPhotos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  return (
    <div className="rc-root">
      <section className="rc-page-section">
        <div className="rc-section-inner">
          {/* Header */}
          <div className="rc-page-header">
            <span className="rc-tag-sub uppercase tracking-[0.25em] text-red-500 font-mono block mb-2">GALLERY</span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-black tracking-tight leading-none">
              From the workshop floor.
            </h1>
          </div>

          {/* Grid */}
          <div className="rc-gallery-grid">
            {displayPhotos.map((photo, idx) => (
              <motion.div
                key={idx}
                className="rc-gallery-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => setSelectedIdx(idx)}
              >
                {/* Background dot grid pattern for technical CAD look */}
                <div className="rc-gallery-dot-grid" />
                
                {/* Show actual image on hover, otherwise show labeled grid */}
                <img
                  src={photo.image_url}
                  alt={photo.caption}
                  className="rc-gallery-img"
                />

                <div className="rc-gallery-label-box">
                  <span className="rc-gallery-label-text">{photo.label}</span>
                </div>

                <div className="rc-gallery-footer">
                  <span className="rc-gallery-caption">{photo.caption}</span>
                  <span className="rc-gallery-dot-marker" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="rc-lightbox"
          >
            <button className="rc-lightbox-close" onClick={() => setSelectedIdx(null)}>
              <X size={20} />
            </button>

            <button className="rc-lightbox-nav rc-left" onClick={prevPhoto}>
              <ChevronLeft size={24} />
            </button>
            <button className="rc-lightbox-nav rc-right" onClick={nextPhoto}>
              <ChevronRight size={24} />
            </button>

            <div className="rc-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={displayPhotos[selectedIdx].image_url}
                alt={displayPhotos[selectedIdx].caption}
                className="rc-lightbox-img"
              />
              <div className="rc-lightbox-caption">
                {displayPhotos[selectedIdx].caption}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
