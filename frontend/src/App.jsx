import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LabStatusHUD from './components/LabStatusHUD';
import { useThemeStore } from './store/themeStore';

// Lazy loaded routes
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Forum = lazy(() => import('./pages/Forum'));
const Resources = lazy(() => import('./pages/Resources'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Team = lazy(() => import('./pages/Team'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-var">
    <div className="w-12 h-12 rounded-full border-2 border-primary-var border-t-transparent animate-spin" />
  </div>
);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

/* ══════════ GLASS SCROLL REVEAL PAGE WRAPPER ══════════
   Wraps each page in a glassmorphism panel that slides up
   and fades in from below when it enters the viewport.
   The overlay gives the site a cohesive dark glass look.
*/
function GlassPageReveal({ children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="glass-page-reveal"
      initial={{ opacity: 0, y: 48, scale: 0.985, filter: 'blur(6px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
          : {}
      }
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════ SECTION GLASS REVEAL
   Used inside Landing to animate individual sections
   as the user scrolls. We export this too so Landing can use it.
*/
export function SectionReveal({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Scale: starts slightly smaller, reaches 1 in the middle, shrinks slightly when leaving
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.93, 1, 1, 0.93]);
  
  // Opacity: starts transparent, fades in, fades out when leaving
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  
  // Blur: starts blurred, clears up in the middle, blurs when leaving
  const filter = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  // Y displacement: slide up when entering, continue sliding up when leaving
  const y = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [80, 0, 0, -80]);

  return (
    <motion.div
      ref={ref}
      className="section-glass-panel"
      style={{ scale, opacity, filter, y }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { init, theme } = useThemeStore();

  useEffect(() => {
    init();
    
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, [init]);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-root-dark">
        
        {/* ── Ambient dark background with subtle noise ── */}
        <div className="app-bg-layer">
          <div className="app-bg-noise" />
          {/* Subtle red ambient glow top-left */}
          <div className="app-bg-glow-tl" />
          {/* Subtle red glow bottom-right */}
          <div className="app-bg-glow-br" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <LabStatusHUD />
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"              element={<Landing />} />
                <Route path="/login"         element={<GlassPageReveal><Login /></GlassPageReveal>} />
                <Route path="/dashboard/admin"  element={<GlassPageReveal><AdminDashboard /></GlassPageReveal>} />
                <Route path="/dashboard/member" element={<GlassPageReveal><MemberDashboard /></GlassPageReveal>} />
                <Route path="/dashboard/user"   element={<GlassPageReveal><UserDashboard /></GlassPageReveal>} />
                <Route path="/forum"         element={<GlassPageReveal><Forum /></GlassPageReveal>} />
                <Route path="/resources"     element={<GlassPageReveal><Resources /></GlassPageReveal>} />
                <Route path="/achievements"  element={<GlassPageReveal><Achievements /></GlassPageReveal>} />
                <Route path="/gallery"       element={<GlassPageReveal><Gallery /></GlassPageReveal>} />
                <Route path="/team"          element={<GlassPageReveal><Team /></GlassPageReveal>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
