import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { apiFetch } from '../utils/api';
import { X, ChevronLeft, ChevronRight, ImageOff, ZoomIn } from 'lucide-react';

/* ─── Single card with error-handling ─── */
function GalleryCard({ photo, idx, onClick }) {
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="rc-gallery-card"
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: (idx % 3) * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(idx)}
      whileHover={{ y: -6 }}
    >
      {/* Background dot grid pattern */}
      <div className="rc-gallery-dot-grid" />

      {imgError ? (
        /* ── Elegant fallback when image fails ── */
        <div className="rc-gallery-no-img">
          <ImageOff size={32} strokeWidth={1.5} />
          <span>Image not available</span>
        </div>
      ) : (
        <img
          src={photo.image_url}
          alt={photo.caption}
          className="rc-gallery-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      )}

      {/* Hover zoom indicator */}
      <div className="rc-gallery-zoom-icon">
        <ZoomIn size={16} />
      </div>

      <div className="rc-gallery-label-box">
        <span className="rc-gallery-label-text">{photo.label}</span>
      </div>

      <div className="rc-gallery-footer">
        <span className="rc-gallery-caption">{photo.caption}</span>
        <span className="rc-gallery-dot-marker" />
      </div>
    </motion.div>
  );
}

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
    { label: 'IMG_01', caption: 'MANIPULATOR DRY-FIT',     image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80' },
    { label: 'IMG_02', caption: 'DRONE BUILD, DAY 1',       image_url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80' },
    { label: 'IMG_03', caption: 'HEXAPOD GAIT TUNING',     image_url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&q=80' },
    { label: 'IMG_04', caption: 'CRAWLER MK.III FIELD TEST',image_url: 'https://images.unsplash.com/photo-1581092921461-7d65ca45393a?w=600&q=80' },
    { label: 'IMG_05', caption: 'PCB REV. 04',              image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
    { label: 'IMG_06', caption: 'VISION RIG ASSEMBLY',     image_url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80' },
  ];

  // Only show static placeholders AFTER loading finishes and DB returned nothing
  const displayPhotos = loading
    ? []
    : photos.length > 0
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
      <section className="rc-gallery-page-section">
        <div className="rc-section-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          {/* Header */}
          <motion.div
            className="rc-gallery-page-header"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="rc-tag-label" style={{ color: '#ff3b30', letterSpacing: '0.2em', display: 'block', marginBottom: '1rem' }}>
              GALLERY
            </span>
            <h1 className="rc-gallery-page-title">
              From the workshop<br />
              <em style={{ fontStyle: 'italic', color: '#ff3b30' }}>floor.</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem', fontSize: '1rem', maxWidth: '480px' }}>
              Every session captured. Browse the builds, tests, and moments that define the club.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="rc-gallery-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rc-gallery-card rc-gallery-skeleton" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="rc-gallery-skeleton-shine" />
                  </div>
                ))
              : displayPhotos.map((photo, idx) => (
                  <GalleryCard
                    key={idx}
                    photo={photo}
                    idx={idx}
                    onClick={setSelectedIdx}
                  />
                ))
            }

            {!loading && displayPhotos.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 0', color: 'rgba(255,255,255,0.3)' }}>
                <ImageOff size={48} strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  No gallery photos yet
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && displayPhotos[selectedIdx] && (
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

            <motion.div
              className="rc-lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={displayPhotos[selectedIdx].image_url}
                alt={displayPhotos[selectedIdx].caption}
                className="rc-lightbox-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="rc-lightbox-caption">
                <span style={{ color: '#ff3b30', marginRight: '0.5rem' }}>◉</span>
                {displayPhotos[selectedIdx].caption}
                <span style={{ marginLeft: '1rem', opacity: 0.4, fontSize: '0.75rem' }}>
                  {selectedIdx + 1} / {displayPhotos.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
