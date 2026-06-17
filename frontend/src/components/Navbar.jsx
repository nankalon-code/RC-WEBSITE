import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../utils/api';

export default function Navbar() {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, init } = useAuthStore();
  const navigate = useNavigate();

  // Refs for click-outside detection
  const notifRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    apiFetch('/announcements').then((d) => {
      const sliced = d.slice(0, 5);
      setAnnouncements(sliced);
      const last = localStorage.getItem('lastCheckedNotifications');
      if (!last) { setHasNew(sliced.length > 0); }
      else {
        const t = new Date(last).getTime();
        setHasNew(sliced.some(a => new Date(a.timestamp).getTime() > t));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleScrollToSection = (id) => {
    if (window.location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollToSection: id } });
    }
    setMobileOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 6, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } },
    exit:    { opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.12 } },
  };

  return (
    <nav className={`rc-navbar ${scrolled ? 'rc-navbar-scrolled' : ''}`}>
      <div className="rc-navbar-inner">
        {/* Brand */}
        <Link to="/" className="rc-brand">
          ROBOTICS <span className="rc-brand-accent">CLUB</span>
        </Link>

        {/* Desktop links */}
        <div className="rc-nav-links">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="rc-nav-link">Home</Link>
          <button onClick={() => handleScrollToSection('about')} className="rc-nav-link">About</button>
          <button onClick={() => handleScrollToSection('events')} className="rc-nav-link">Events</button>
          <Link to="/achievements" className="rc-nav-link">Achievements</Link>
          <Link to="/team" className="rc-nav-link">Team</Link>
          <Link to="/gallery" className="rc-nav-link">Gallery</Link>
          <Link to="/forum" className="rc-nav-link">Forum</Link>
          <Link to="/resources" className="rc-nav-link">Resources</Link>
          {isAuthenticated && user && (
            <Link to={`/dashboard/${user.role}`} className="rc-nav-link rc-nav-link-bold">Dashboard</Link>
          )}
        </div>

        {/* Right controls */}
        <div className="rc-nav-controls">

          {/* Notifications */}
          <div className="rc-notif-wrap" ref={notifRef}>
            <button
              className="rc-icon-btn rc-notif-btn"
              onClick={() => {
                setNotificationsOpen(!isNotificationsOpen);
                setDropdownOpen(false);
                if (!isNotificationsOpen) {
                  localStorage.setItem('lastCheckedNotifications', new Date().toISOString());
                  setHasNew(false);
                }
              }}
              aria-label="Notifications"
            >
              <Bell size={14} />
              {hasNew && <span className="rc-notif-dot" />}
            </button>
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="rc-dropdown"
                >
                  <div className="rc-dropdown-header">Notifications</div>
                  <div className="rc-dropdown-body">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="rc-dropdown-item">
                        <div className="rc-dropdown-item-type">{ann.type}</div>
                        <div className="rc-dropdown-item-msg">{ann.message}</div>
                        <div className="rc-dropdown-item-date">{new Date(ann.timestamp).toLocaleDateString()}</div>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="rc-dropdown-empty">No notifications</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account / Sign In */}
          {isAuthenticated ? (
            <div className="rc-notif-wrap" ref={accountRef}>
              <button
                onClick={() => { setDropdownOpen(!isDropdownOpen); setNotificationsOpen(false); }}
                className="rc-btn-join"
              >
                Account
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="rc-dropdown"
                  >
                    {user?.role === 'admin' ? (
                      <>
                        <div className="rc-dropdown-header">Admin Controls</div>
                        <Link to="/dashboard/admin" onClick={() => setDropdownOpen(false)} className="rc-dropdown-link" style={{color:'#ff3b30', fontWeight: 700}}>Admin Panel</Link>
                        <Link to="/dashboard/member" onClick={() => setDropdownOpen(false)} className="rc-dropdown-link">Member View</Link>
                        <Link to="/dashboard/user" onClick={() => setDropdownOpen(false)} className="rc-dropdown-link">User View</Link>
                        <div style={{height:'1px', background:'rgba(255,255,255,0.08)'}} />
                        <button onClick={() => { setDropdownOpen(false); handleLogout(); }} className="rc-dropdown-link">Sign Out</button>
                      </>
                    ) : (
                      <>
                        <Link to={`/dashboard/${user?.role}`} onClick={() => setDropdownOpen(false)} className="rc-dropdown-link">Dashboard</Link>
                        <button onClick={() => { setDropdownOpen(false); handleLogout(); }} className="rc-dropdown-link">Sign Out</button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="rc-btn-join">Sign In</Link>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!isMobileOpen)} className="rc-mobile-toggle" aria-label="Menu">
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.18 } }}
            className="rc-mobile-menu"
          >
            <Link to="/" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Home</Link>
            <button onClick={() => handleScrollToSection('about')} className="rc-mobile-link">About</button>
            <button onClick={() => handleScrollToSection('events')} className="rc-mobile-link">Events</button>
            <Link to="/achievements" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Achievements</Link>
            <Link to="/team" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Team</Link>
            <Link to="/gallery" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Gallery</Link>
            <Link to="/forum" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Forum</Link>
            <Link to="/resources" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Resources</Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <>
                    <Link to="/dashboard/admin" onClick={() => setMobileOpen(false)} className="rc-mobile-link" style={{color:'#ff3b30', fontWeight: 700}}>Admin Panel</Link>
                    <Link to="/dashboard/member" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Member View</Link>
                    <Link to="/dashboard/user" onClick={() => setMobileOpen(false)} className="rc-mobile-link">User View</Link>
                  </>
                ) : (
                  <Link to={`/dashboard/${user?.role}`} onClick={() => setMobileOpen(false)} className="rc-mobile-link">Dashboard</Link>
                )}
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="rc-mobile-link">Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rc-mobile-link">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
