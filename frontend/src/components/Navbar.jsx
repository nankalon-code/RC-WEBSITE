import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { apiFetch } from '../utils/api';

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, init } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    apiFetch('/announcements').then((d) => setAnnouncements(d.slice(0, 5))).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isDark = theme === 'dark';

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50">
      <div className={`navbar-glass ${scrolled ? 'scrolled' : ''} flex items-center justify-between px-5 py-2.5 transition-all duration-500`}>
        <Link to="/" className="text-sm font-display font-black tracking-[0.18em] uppercase" style={{ color: 'var(--color-text-main)' }}>
          ROBOTICS<span className="text-[var(--color-text-muted)] ml-0.5">CLUB</span>
        </Link>

        <div className="hidden md:flex items-center space-x-5 text-sm font-medium">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-accent transition-colors text-muted-var">Home</Link>
          <a href="/#about" className="hover:text-accent transition-colors text-muted-var">About</a>
          <Link to="/achievements" className="hover:text-accent transition-colors text-muted-var">Achievements</Link>
          <Link to="/team" className="hover:text-accent transition-colors text-muted-var">Team</Link>
          <Link to="/gallery" className="hover:text-accent transition-colors text-muted-var">Gallery</Link>
          <Link to="/forum" className="hover:text-accent transition-colors text-muted-var">Forum</Link>
          <Link to="/resources" className="hover:text-accent transition-colors text-muted-var">Resources</Link>

          {isAuthenticated && user && (
            <Link to={`/dashboard/${user.role}`} className="hover:text-accent transition-colors text-primary-var font-semibold">Dashboard</Link>
          )}

          {/* Separator */}
          <div className="h-4 w-px bg-[var(--color-border)]" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[var(--glass-bg-hover)]"
            style={{ border: '1px solid var(--color-border)' }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun size={13} style={{ color: 'var(--color-text-muted)' }} /> : <Moon size={13} style={{ color: 'var(--color-text-muted)' }} />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!isNotificationsOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-all hover:bg-[var(--glass-bg-hover)]"
              style={{ color: 'var(--color-text-main)', border: '1px solid var(--color-border)' }}
            >
              <Bell size={13} />
              {announcements.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              )}
            </button>
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 border rounded-2xl shadow-2xl overflow-hidden"
                  style={{ background: 'var(--dropdown-bg)', borderColor: 'var(--color-border)' }}
                >
                  <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <span className="font-bold text-sm" style={{ color: 'var(--color-text-main)' }}>Notifications</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-4 cursor-pointer transition-colors hover:bg-[var(--glass-bg)]" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>{ann.type}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-main)', opacity: 0.7 }}>{ann.message}</p>
                        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)', opacity: 0.3 }}>{new Date(ann.timestamp).toLocaleDateString()}</p>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="p-4 text-sm" style={{ color: 'var(--color-text-muted)', opacity: 0.4 }}>No notifications</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all hover:shadow-lg"
                style={{ background: 'var(--color-primary)', color: 'var(--color-base)' }}
              >
                {user?.name?.split(' ')[0] || 'Account'}
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-44 border rounded-2xl shadow-xl overflow-hidden py-2"
                    style={{ background: 'var(--dropdown-bg)', borderColor: 'var(--color-border)' }}
                  >
                    <Link to={`/dashboard/${user?.role}`} onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--glass-bg)]" style={{ color: 'var(--color-text-muted)' }}>Dashboard</Link>
                    <button onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--glass-bg)]" style={{ color: 'var(--color-text-muted)' }}>Sign Out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all hover:shadow-lg"
                style={{ background: 'var(--color-primary)', color: 'var(--color-base)' }}
              >
                Join Us
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-44 border rounded-2xl shadow-xl overflow-hidden py-2"
                    style={{ background: 'var(--dropdown-bg)', borderColor: 'var(--color-border)' }}
                  >
                    <Link to="/login" onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--glass-bg)]" style={{ color: 'var(--color-text-muted)' }}>Join Club</Link>
                    <Link to="/forum" onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--glass-bg)]" style={{ color: 'var(--color-text-muted)' }}>Join Forum</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggleTheme} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)' }}>
            {isDark ? <Sun size={14} style={{ color: 'var(--color-text-muted)' }} /> : <Moon size={14} style={{ color: 'var(--color-text-muted)' }} />}
          </button>
          <button onClick={() => setMobileOpen(!isMobileOpen)} style={{ color: 'var(--color-text-muted)' }}>
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="md:hidden absolute top-full left-0 right-0 mt-3 border rounded-3xl p-5 space-y-2 backdrop-blur-3xl shadow-2xl z-50"
            style={{ 
              background: isDark ? 'rgba(0, 0, 0, 0.96)' : 'rgba(255, 255, 255, 0.96)', 
              borderColor: 'var(--color-border)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Home</Link>
            <Link to="/achievements" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Achievements</Link>
            <Link to="/team" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Team</Link>
            <Link to="/gallery" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Gallery</Link>
            <Link to="/forum" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Forum</Link>
            <Link to="/resources" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Resources</Link>
            {isAuthenticated ? (
              <>
                <Link to={`/dashboard/${user?.role}`} onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Dashboard</Link>
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="block py-3 px-4 rounded-xl text-base font-bold w-full text-left hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-base font-bold hover:bg-[var(--glass-bg-hover)] transition-colors" style={{ color: 'var(--color-text-main)' }}>Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
