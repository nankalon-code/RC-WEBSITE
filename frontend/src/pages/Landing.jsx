import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { apiFetch } from '../utils/api';

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

/* ─── Main Landing ──────────────────────────────────────────── */
export default function Landing() {
  const [siteContent, setSiteContent] = useState({});
  const [events, setEvents] = useState([]);
  const [activeArchTab, setActiveArchTab] = useState(0);
  const location = useLocation();
  const heroRef = useRef(null);
  const cursorRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    apiFetch('/site-content').then(setSiteContent).catch(() => {});
    apiFetch('/events').then(setEvents).catch(() => {});
  }, []);

  // Cursor glow tracking
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    const move = (e) => {
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
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
      {/* Cursor glow orb */}
      <div ref={cursorRef} className="cursor-glow" />

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="rc-hero" id="home" style={{position:'relative',overflow:'hidden'}}>

        {/* page counter */}
        <div className="rc-page-counter">
          <span className="rc-pc-current">002</span>
          <span className="rc-pc-sep">/</span>
          <span className="rc-pc-total">006</span>
          <span className="rc-pc-label">INDEX</span>
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="rc-hero-inner">
          {/* Left editorial column */}
          <div className="rc-hero-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rc-eyebrow"
            >
              <span className="rc-eyebrow-line" />
              <span className="rc-eyebrow-text">ENGINEERING SOCIETY</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="rc-hero-headline"
            >
              We build<br />
              <span className="rc-scribble-underline">machines</span> that<br />
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
              <Link to="/forum" className="rc-btn-primary">
                EXPLORE PROJECTS →
              </Link>
              <Link to="/login" className="rc-btn-outline">
                JOIN THE CLUB
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              className="rc-hero-stats"
            >
              <StatNum val={siteContent.stat_projects || '42'} label="MEMBERS" />
              <StatNum val={siteContent.stat_members || '11'} label="BOTS SHIPPED" />
              <StatNum val={siteContent.stat_wins || '6'} label="COMPETITIONS" />
            </motion.div>
          </div>

          {/* Right: robot arm image */}
          <motion.div
            className="rc-hero-right"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rc-hero-img-wrap">
              {/* HUD labels */}
              <div className="rc-hud-label rc-hud-tr">
                MANIPULATOR<br />
                <span className="rc-hud-accent">• GRIPPER MODULE</span>
              </div>
              <div className="rc-hud-label rc-hud-bl">
                REF. ST-2026.B<br />
                6 DOF · 4.5KG PAYLOAD
              </div>
              <img
                src="/robot_arm_hero.png"
                alt="6-DOF robot arm manipulator"
                className="rc-hero-img"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <div className="rc-scroll-cue">↓ Scroll</div>
        {/* Handwriting annotation */}
        <span className="rc-handwrite-note" style={{position:'absolute',bottom:'2.8rem',right:'2.5rem'}}>since 2013 ✦</span>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="rc-section">
        <div className="rc-section-inner">
          <div className="rc-section-header">
            <div>
              <span className="rc-tag-label">002A</span>
              <span className="rc-tag-sub">BUILD WITH PRECISION</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rc-section-title"
            >
              Features
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
      </section>

      {/* ══════════ MANIFESTO ══════════ */}
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
            <span className="rc-tag-label">001</span>
            <motion.h2
              className="rc-manifesto-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              We are engineers first. The club is a workshop, a lab, and an open archive of everything we've broken and rebuilt.
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

          {/* Bottom quote block */}
          <motion.div
            className="rc-manifesto-quote-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="rc-manifesto-quote-bar" />
            <p className="rc-manifesto-quote-text">
              We learn and we share.
            </p>
          </motion.div>
        </div>
      </section>
      {/* ══════════ SYSTEM ARCHITECTURE ══════════ */}
      <section id="architecture" className="rc-arch-section">
        <div className="rc-section-inner">
          <div className="rc-arch-header">
            <div>
              <span className="rc-tag-label">003 / 01</span>
            </div>
            <div className="rc-arch-header-content">
              <motion.h2
                className="rc-arch-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                System architecture,<br />explored layer by layer.
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
                <div className="rc-arch-coords">
                  <span>X 42.091</span>
                  <span>Y 12.884</span>
                  <span>Z 0.002</span>
                  <span className="rc-arch-page-ind">01 /<br />BUILD</span>
                </div>
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
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section id="about" className="rc-about-section">
        <div className="rc-section-inner">
          <div className="rc-about-layout">
            {/* Left: text */}
            <div className="rc-about-left">
              <span className="rc-tag-label">003</span>
              <motion.h2
                className="rc-about-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                About the Club
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
                  src={siteContent.faculty_photo || 'https://i.pravatar.cc/150?u=faculty'}
                  alt="Faculty"
                  className="rc-faculty-img"
                />
                <div>
                  <div className="rc-faculty-name">
                    {siteContent.faculty_name || 'Dr. Faculty Name'}
                  </div>
                  <div className="rc-faculty-role">FACULTY COORDINATOR</div>
                </div>
              </div>
              <p className="rc-faculty-quote">
                "{siteContent.faculty_bio || 'Leading research in robotics and autonomous systems.'}"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ EVENTS (if present) ══════════ */}
      {events.length > 0 && (
        <section id="events" className="rc-section">
          <div className="rc-section-inner">
            <div className="rc-section-header">
              <span className="rc-tag-label">004</span>
              <h2 className="rc-section-title">Upcoming Events</h2>
              <p className="rc-section-desc">Workshops, hackathons, and guest lectures.</p>
            </div>
            <div className="rc-events-list">
              {events.slice(0, 4).map((ev, i) => (
                <motion.div
                  key={ev.id}
                  className="rc-event-row"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <span className="rc-event-date">{ev.date}</span>
                  <div className="rc-event-info">
                    <span className="rc-event-title">{ev.title}</span>
                    <span className="rc-event-desc">{ev.description}</span>
                  </div>
                  <span className="rc-event-type">{ev.type || 'EVENT'}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
