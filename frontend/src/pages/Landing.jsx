import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { X, ArrowRight, Users, Calendar, Cpu, Zap } from 'lucide-react';
import { SectionReveal } from '../App';
import TechFrame from '../components/TechFrame';

/* ─── Counter hook ─────────────────────────────────────────── */
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(end) || 0;
    if (num === 0) { setCount(end); return; }
    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(end); clearInterval(timer); } else setCount(String(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return [ref, count];
}

/* ─── Stat number ───────────────────────────────────────────── */
function StatNum({ val, label }) {
  const [ref, v] = useCounter(val);
  return (
    <div ref={ref} className="rc-stat">
      <span className="rc-stat-val">{v}</span>
      <span className="rc-stat-label">{label}</span>
    </div>
  );
}

/* ─── Architecture tab data ─────────────────────────────────── */
const ARCH_TABS = [
  {
    id: 'firmware',
    label: '01 RC CAR',
    module: 'MODULE 01',
    title: 'Remote control car',
    desc: 'Custom-built RC car with wireless control, precision steering, and high-torque drivetrain. Designed and assembled by club members for speed trials and obstacle courses.',
    specs: [
      { label: 'MOTOR', val: '540 Brushless 3300KV' },
      { label: 'RANGE', val: '200 m 2.4 GHz' },
      { label: 'SPEED', val: '45 km/h top speed' },
      { label: 'CONTROL', val: 'Arduino + nRF24L01' },
    ],
  },
  {
    id: 'peripherals',
    label: '02 PERIPHERALS',
    module: 'MODULE 02',
    title: 'Sensor fusion pipeline',
    desc: 'Multi-modal sensor array with real-time fusion: LiDAR, IMU, encoders, and camera streams processed on dedicated cores.',
    specs: [
      { label: 'SENSORS', val: 'LiDAR + IMU + Cam' },
      { label: 'LATENCY', val: '< 2 ms end-to-end' },
      { label: 'BUS', val: 'CAN FD / SPI / I²C' },
      { label: 'SYNC', val: 'Hardware timestamp' },
    ],
  },
  {
    id: 'power',
    label: '03 POWER DYNAMICS',
    module: 'MODULE 03',
    title: 'Smart power distribution',
    desc: 'Distributed power architecture with per-rail monitoring, hot-swap support, and automatic load balancing across all subsystems.',
    specs: [
      { label: 'VOLTAGE', val: '12V / 5V / 3.3V rails' },
      { label: 'CAPACITY', val: '10 Ah LiFePO₄' },
      { label: 'MONITORING', val: 'Per-rail INA226' },
      { label: 'PROTECTION', val: 'OCP + OVP + UVP' },
    ],
  },
  {
    id: 'chassis',
    label: '04 CHASSIS',
    module: 'MODULE 04',
    title: 'Structural frame design',
    desc: 'Modular aluminium extrusion frame with FEA-optimised joints. Designed for rapid swap of subsystems and competition reconfiguration.',
    specs: [
      { label: 'MATERIAL', val: '6061-T6 Aluminium' },
      { label: 'WEIGHT', val: '4.5 kg without payload' },
      { label: 'DOF', val: '6 DOF manipulator' },
      { label: 'PAYLOAD', val: 'Up to 3 kg' },
    ],
  },
];

/* ─── Magnetic Button ───────────────────────────────────────── */
function MagneticBtn({ children, className, to, onClick, style }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  }, []);
  return (
    <Link
      ref={ref}
      to={to || '#'}
      className={className}
      onClick={onClick}
      style={{ transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)', display: 'inline-flex', alignItems: 'center', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
}

/* ─── Live Coords ────────────────────────────────────────────── */
function LiveCoords() {
  const [coords, setCoords] = useState({ x: '42.091', y: '12.884', z: '0.002' });
  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({
        x: (40 + Math.random() * 5).toFixed(3),
        y: (11 + Math.random() * 4).toFixed(3),
        z: (Math.random() * 0.01).toFixed(4),
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="rc-arch-coords">
      <motion.span key={coords.x} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>X {coords.x}</motion.span>
      <motion.span key={coords.y + 'y'} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>Y {coords.y}</motion.span>
      <motion.span key={coords.z + 'z'} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>Z {coords.z}</motion.span>
      <span className="rc-arch-page-ind">01 /<br />BUILD</span>
    </div>
  );
}

/* ─── Dot Grid Hero Background ───────────────────────────────── */
function DotGrid() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: 'radial-gradient(rgba(20, 20, 30, 0.12) 1.2px, transparent 1.2px)',
        backgroundSize: '36px 36px',
        opacity: 0.8
      }}
    />
  );
}

/* ─── Main Landing ──────────────────────────────────────────── */
export default function Landing() {
  const [siteContent, setSiteContent] = useState({});
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeArchTab, setActiveArchTab] = useState(0);
  const location = useLocation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    apiFetch('/site-content').then(setSiteContent).catch(() => {});
    apiFetch('/events').then(setEvents).catch(() => {});
    apiFetch('/display-members').then(d => setMembers(d || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (location.state?.scrollToSection) {
      const id = location.state.scrollToSection;
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      window.history.replaceState({}, document.title);
    } else if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const activeTab = ARCH_TABS[activeArchTab];

  return (
    <div className="rc-root">
      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="rc-hero" id="home" style={{ position: 'relative', overflow: 'hidden' }}>
          <DotGrid />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="rc-hero-inner">
            {/* Left editorial column */}
            <div className="rc-hero-left">

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="rc-hero-headline"
              >
                We build<br />
                <span className="rc-highlight-cyan">machines</span> that<br />
                <em className="rc-hero-em">think for<br />themselves.</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="rc-hero-desc"
              >
                A student-run robotics club designing autonomous systems from the silicon up — kinematics, firmware, perception, fabrication. All in one workshop.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="rc-hero-ctas"
              >
                <MagneticBtn to="/forum" className="rc-btn-primary">
                  EXPLORE PROJECTS →
                </MagneticBtn>
                <MagneticBtn to="/login" className="rc-btn-outline">
                  JOIN THE CLUB
                </MagneticBtn>
              </motion.div>


            </div>

            {/* Right: robot animation video */}
            <motion.div
              className="rc-hero-right"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rc-hero-img-wrap" style={{ overflow: 'hidden' }}>
                <video
                  src="/robot_animation.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rc-hero-video"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* scroll cue */}
          <div className="rc-scroll-cue">↓ Scroll</div>
          {/* Handwriting annotation */}
          <span className="rc-handwrite-note" style={{ position: 'absolute', bottom: '2.8rem', right: '15rem' }}>since 2013 ✦</span>
        </section>

      {/* ══════════ FEATURES ══════════ */}
      <SectionReveal delay={0}>
      <section id="features" className="rc-section">
        <TechFrame>
          <div className="rc-section-inner">
            <div className="rc-section-header">
              <div>
                <span className="rc-tag-sub">BUILD WITH PRECISION</span>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rc-section-title"
              >
                <span className="rc-highlight-cyan">Precision</span> Features
              </motion.h2>
              <p className="rc-section-desc">
                Build awesome robots and smart software with direct help from mentors, great resources, and cool team opportunities.
              </p>
            </div>

            <div className="rc-features-grid">
              {[
                {
                  num: '01',
                  title: 'Cool Hardware',
                  desc: 'Get hands-on experience building real robots with parts like microcontrollers, motors, and sensors.',
                },
                {
                  num: '02',
                  title: 'Smart Software',
                  desc: 'Learn to write code for robots, build AI models, computer vision systems, and simulator tools.',
                },
                {
                  num: '03',
                  title: 'Lock Your Ideas',
                  desc: 'Pick from 50 unique projects, lock your choice with a team, and build a resume-ready project.',
                },
                {
                  num: '04',
                  title: 'Join a Team',
                  desc: 'Work in teams of 2 to 4 students with full support and guidance from experienced club mentors.',
                },
              ].map((f, i) => (
                <motion.div
                  key={f.num}
                  className="rc-feature-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div className="rc-feature-top">
                    <span className="rc-feature-num">{f.num}</span>
                    <span className="rc-feature-arrow">↗</span>
                  </div>
                  <h3 className="rc-feature-title">{f.title}</h3>
                  <p className="rc-feature-desc">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </TechFrame>
      </section>
      </SectionReveal>

      {/* ══════════ MANIFESTO ══════════ */}
      <SectionReveal delay={0.05}>
      <section id="manifesto" className="rc-manifesto-section">
          <div className="rc-section-inner">
            {/* Decorative grid blocks */}
            <div className="rc-manifesto-deco-grid" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="rc-manifesto-deco-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                />
              ))}
            </div>

            <div className="rc-manifesto-header">
              <motion.h2
                className="rc-manifesto-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              >
                We are <span className="rc-highlight-cyan">engineers first</span>. The club is a workshop, a lab, and an open archive of everything we've broken and rebuilt.
              </motion.h2>
            </div>

            <div className="rc-manifesto-pillars">
              {[
                {
                  num: '01',
                  title: 'Build, don\'t theorize.',
                  desc: 'Every idea ends as a working prototype on the bench, or it doesn\'t count.',
                },
                {
                  num: '02',
                  title: 'Document the silicon up.',
                  desc: 'Schematics, firmware and CAD files live in the open repo — always.',
                },
                {
                  num: '03',
                  title: 'Ship for competition.',
                  desc: 'We design with deadlines. Robots that don\'t roll on game day are unfinished.',
                },
              ].map((p, i) => (
                <motion.div
                  key={p.num}
                  className="rc-pillar-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.65 }}
                  whileHover={{ y: -6 }}
                >
                  <span className="rc-pillar-num">{p.num}</span>
                  <h3 className="rc-pillar-title">{p.title}</h3>
                  <p className="rc-pillar-desc">{p.desc}</p>
                  <div className="rc-pillar-accent-bar" />
                </motion.div>
              ))}
            </div>

            {/* Club stats strip */}
            <motion.div
              className="rc-manifesto-stats-strip"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              {[
                { val: '42+', label: 'Active Members' },
                { val: '11', label: 'Projects Shipped' },
                { val: '6', label: 'Competitions Won' },
                { val: '2013', label: 'Founded' },
              ].map((s, i) => (
                <div key={i} className="rc-manifesto-stat-item">
                  <span className="rc-manifesto-stat-val">{s.val}</span>
                  <span className="rc-manifesto-stat-label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
      </section>
      </SectionReveal>

      {/* ══════════ SYSTEM ARCHITECTURE ══════════ */}
      <SectionReveal delay={0}>
      <section id="architecture" className="rc-arch-section">
        <TechFrame>
          <div className="rc-section-inner">
            <div className="rc-arch-header">
              <div className="rc-arch-header-content">
                <motion.h2
                  className="rc-arch-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="rc-highlight-cyan">System architecture</span>,<br />explored layer by layer.
                </motion.h2>
                <p className="rc-arch-subtitle">
                  Every system the club ships is documented down to the silicon. Pick a layer to inspect the spec sheet.
                </p>
              </div>
            </div>

            <div className="rc-arch-panel">
              {/* Left: wireframe */}
              <div className="rc-arch-left">
                <div className="rc-arch-viewport-label">
                  <span>WIREFRAME / VIEWPORT_01</span>
                  <span className="rc-arch-live">• LIVE</span>
                </div>
                <div className="rc-arch-wireframe-box">
                  <img
                    src="/robot_chassis_suspension.jpg"
                    alt="Robot chassis wireframe"
                    className="rc-arch-wireframe-img"
                  />
                  <LiveCoords />
                </div>
              </div>

              {/* Right: spec panel */}
              <div className="rc-arch-right">
                {/* Tabs */}
                <div className="rc-arch-tabs">
                  {ARCH_TABS.map((tab, i) => (
                    <button
                      key={tab.id}
                      className={`rc-arch-tab ${activeArchTab === i ? 'active' : ''}`}
                      onClick={() => setActiveArchTab(i)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Spec content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeArchTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="rc-arch-spec"
                  >
                    <span className="rc-arch-module-label">{activeTab.module}</span>
                    <h3 className="rc-arch-spec-title">{activeTab.title}</h3>
                    <p className="rc-arch-spec-desc">{activeTab.desc}</p>

                    <div className="rc-arch-spec-divider" />

                    <div className="rc-arch-spec-grid">
                      {activeTab.specs.map((s) => (
                        <div key={s.label} className="rc-arch-spec-item">
                          <span className="rc-arch-spec-key">{s.label}</span>
                          <span className="rc-arch-spec-val">{s.val}</span>
                        </div>
                      ))}
                    </div>

                    <button className="rc-btn-outline rc-download-btn">
                      DOWNLOAD DATASHEET →
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </TechFrame>
      </section>
      </SectionReveal>

      {/* ══════════ ABOUT ══════════ */}
      <SectionReveal delay={0}>
      <section id="about" className="rc-about-section">
        <TechFrame>
          <div className="rc-section-inner">
            <div className="rc-about-layout">
              {/* Left: text */}
              <div className="rc-about-left">
                <motion.h2
                  className="rc-about-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="rc-highlight-cyan">About</span> the Club
                </motion.h2>
                <p className="rc-about-p">
                  {siteContent.about_text ||
                    'The Robotics Club is an advanced engineering hub dedicated to solving real-world challenges through intelligent automation.'}
                </p>
                <p className="rc-about-p">
                  {siteContent.about_text_2 ||
                    'We provide resources, mentorship, and environment to bring your vision to life.'}
                </p>
              </div>

              {/* Right: faculty card */}
              <motion.div
                className="rc-faculty-card"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <div className="rc-faculty-top">
                  <img
                    src="/faculty.png"
                    alt="Dr. Deepak Bhatia"
                    className="rc-faculty-img"
                  />
                  <div>
                    <div className="rc-faculty-name">
                      Dr. Deepak Bhatia
                    </div>
                    <div className="rc-faculty-role">FACULTY COORDINATOR</div>
                  </div>
                </div>
                <p className="rc-faculty-quote">
                  "As the faculty coordinator of the robotics club, Dr. Deepak Bhatia provides invaluable mentorship that transforms innovative ideas into successful projects. His expert guidance and constant encouragement inspire students to excel in the competitive field of robotics."
                </p>
              </motion.div>
            </div>
          </div>
        </TechFrame>
      </section>
      </SectionReveal>

      {/* ══════════ MEET THE TEAM ══════════ */}
      <SectionReveal delay={0}>
      <section id="team-preview" className="rc-team-preview-section">
        <TechFrame>
          <div className="rc-section-inner">
            <div className="rc-section-header" style={{ marginBottom: '2.5rem' }}>
              <div>
                <span className="rc-tag-sub">THE CREW</span>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rc-section-title"
              >
                Meet the <span className="rc-highlight-cyan">Team</span>
              </motion.h2>
              <p className="rc-section-desc">The people turning ideas into robots. Builders, tinkerers, and the occasional philosopher.</p>
            </div>

            <div className="rc-team-scroll-wrap">
              <div className="rc-team-scroll-track">
                {members.length > 0
                  ? members.slice(0, 10).map((m, i) => (
                      <motion.div
                        key={m.id}
                        className="rc-team-scroll-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.5 }}
                        whileHover={{ y: -6, scale: 1.03 }}
                      >
                        <div className="rc-team-scroll-img-wrap">
                          <img
                            src={m.photo_url || `https://i.pravatar.cc/300?u=${m.id}`}
                            alt={m.name}
                            className="rc-team-scroll-img"
                          />
                        </div>
                        <div className="rc-team-scroll-info">
                          <span className="rc-team-scroll-name">{m.name}</span>
                          <span className="rc-team-scroll-role">{m.role}</span>
                        </div>
                      </motion.div>
                    ))
                  : Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rc-team-scroll-card" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="rc-team-scroll-img-wrap" style={{ background: '#e4e4e7' }} />
                        <div className="rc-team-scroll-info">
                          <div style={{ height: '12px', borderRadius: '4px', background: '#e4e4e7', marginBottom: '6px', width: '80%' }} />
                          <div style={{ height: '10px', borderRadius: '4px', background: '#ececef', width: '55%' }} />
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ marginTop: '2rem' }}
            >
              <Link to="/team" className="rc-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={14} /> VIEW FULL ROSTER →
              </Link>
            </motion.div>
          </div>
        </TechFrame>
      </section>
      </SectionReveal>

      {/* ══════════ EVENTS ══════════ */}
      <SectionReveal delay={0}>
      <section id="events" className="rc-section">
        <TechFrame>
          <div className="rc-section-inner">
            <div className="rc-section-header">
              <h2 className="rc-section-title">Upcoming <span className="rc-highlight-cyan">Events</span></h2>
              <p className="rc-section-desc">Workshops, hackathons, and guest lectures. Click any event to see full details.</p>
            </div>
            <div className="rc-events-list">
              {(events.length > 0 ? events : [
                { id: 1, date: '2026-07-10', title: 'Annual Hackathon', description: '48-hour build sprint — bring your best ideas.', type: 'HACKATHON' },
                { id: 2, date: '2026-08-01', title: 'Project Showcase', description: 'Present your semester project to faculty and industry guests.', type: 'SHOWCASE' },
                { id: 3, date: '2026-08-20', title: 'Robotics Workshop', description: 'Hands-on session covering ROS2 and sensor integration.', type: 'WORKSHOP' },
              ]).slice(0, 4).map((ev, i) => (
                <motion.div
                  key={ev.id || i}
                  className="rc-event-row rc-event-row-clickable"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  onClick={() => setSelectedEvent(ev)}
                  whileHover={{ x: 8 }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="rc-event-date">{ev.date}</span>
                  <div className="rc-event-info">
                    <span className="rc-event-title">{ev.title}</span>
                    <span className="rc-event-desc">{ev.description}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="rc-event-type">{ev.type || 'EVENT'}</span>
                    <ArrowRight size={16} style={{ color: '#0f172a', opacity: 0.6 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TechFrame>
      </section>
      </SectionReveal>

      {/* ══════════ CONTACT ══════════ */}
      <SectionReveal delay={0}>
      <section id="contact" className="rc-contact-dark-section">
        <TechFrame>
          <div className="rc-contact-dark-inner" style={{ padding: '1rem 0' }}>
            {/* Left */}
            <div className="rc-contact-dark-left">
              <div className="rc-contact-dark-label">
                <span className="rc-contact-dark-dot" />
                COMMS OPEN
              </div>
              <h2 className="rc-contact-dark-title">
                Drop us a <span className="rc-highlight-cyan">signal.</span>
              </h2>
              <p className="rc-contact-dark-desc">
                We're in the lab most days. Whether you want to join, collaborate, or sponsor us — hit us up. No corporate emails, just real people.
              </p>
              <div className="rc-contact-dark-grid">
                <div className="rc-contact-dark-cell">
                  <span className="rc-contact-dark-cell-label">FOR JOINING</span>
                  <span className="rc-contact-dark-cell-val">Use the forum or login portal</span>
                </div>
                <div className="rc-contact-dark-cell">
                  <span className="rc-contact-dark-cell-label">FOR SPONSORS</span>
                  <span className="rc-contact-dark-cell-val">Mention it in the subject line</span>
                </div>
                <div className="rc-contact-dark-cell">
                  <span className="rc-contact-dark-cell-label">RESPONSE TIME</span>
                  <span className="rc-contact-dark-cell-val">Usually same day</span>
                </div>
              </div>
              <div className="rc-contact-dark-btns">
                <Link to="/login" className="rc-contact-dark-btn-primary">APPLY TO JOIN →</Link>
                <Link to="/forum" className="rc-contact-dark-btn-outline">VISIT THE WORKSHOP</Link>
              </div>
            </div>

            {/* Right: robot image panel */}
            <motion.div
              className="rc-contact-dark-right"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="rc-contact-dark-img-box">
                <img src="/robot_arm_hero.png" alt="Robot arm" className="rc-contact-dark-img" />
                <div className="rc-contact-dark-img-caption">
                  <span className="rc-contact-dark-dot" />
                  UNIT-04 / IDLE — AWAITING SIGNAL
                </div>
              </div>
            </motion.div>
          </div>
        </TechFrame>
      </section>
      </SectionReveal>

      {/* ══════════ EVENT POPUP MODAL ══════════ */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="rc-event-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="rc-event-modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button className="rc-event-modal-close" onClick={() => setSelectedEvent(null)}>
                <X size={18} />
              </button>
              <div className="rc-event-modal-tag">{selectedEvent.type || 'EVENT'}</div>
              <h3 className="rc-event-modal-title">{selectedEvent.title}</h3>
              <div className="rc-event-modal-date">
                <Calendar size={14} />
                {selectedEvent.date}
              </div>
              <p className="rc-event-modal-desc">{selectedEvent.description}</p>
              <div className="rc-event-modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <Cpu size={12} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  Check the forum for updates
                </span>
                <button
                  className="rc-btn-outline"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.75rem' }}
                  onClick={() => setSelectedEvent(null)}
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
