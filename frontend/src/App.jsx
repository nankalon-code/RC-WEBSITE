import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const isDark = theme === 'dark';

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans relative overflow-hidden transition-colors duration-500 bg-base-var text-primary-var">
        
        {/* Dynamic Animated Premium Background System (Pitch Black Dark Mode) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--color-base)] transition-colors duration-500">
          {/* Grainy Noise Overlay */}
          <div className="absolute inset-0 noise-overlay opacity-[0.035] mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <LabStatusHUD />
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/member" element={<MemberDashboard />} />
                <Route path="/dashboard/user" element={<UserDashboard />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<Team />} />
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
