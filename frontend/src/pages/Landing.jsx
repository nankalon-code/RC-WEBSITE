import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import TechGyroscope from '../components/TechGyroscope';
import ErrorBoundary from '../components/ErrorBoundary';
import { apiFetch } from '../utils/api';
import { Cpu, GitBranch, Users, Zap, Calendar } from 'lucide-react';

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

function StatCard({ val, label, delay }) {
  const [ref, v] = useCounter(val);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.6 }}>
      <div className="glass-card rounded-2xl p-8 text-center glass-card-hover border-var">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50" />
        <h4 className="text-4xl lg:text-5xl font-display font-bold mb-2 text-primary-var">{v}</h4>
        <p className="text-sm text-muted-var">{label}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, desc, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4 + delay, ease: 'easeInOut' }}
        className="hover-tilt"
      >
        <div className="glass-card glass-card-hover rounded-2xl p-5 w-52 cursor-default border-var bg-base-var/50 backdrop-blur-md shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60" />
          <Icon size={20} className="mb-3 text-accent" />
          <h4 className="text-sm font-bold mb-1 text-primary-var">{title}</h4>
          <p className="text-xs leading-relaxed text-muted-var opacity-80">{desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MagneticButton({ children, className, onClick, ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    </motion.div>
  );
}

function EventCountdown({ dateStr }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const target = new Date(dateStr).getTime();
    if (isNaN(target)) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const dist = target - now;
      if (dist < 0) { setTimeLeft('Started'); clearInterval(timer); return; }
      const d = Math.floor(dist / (1000 * 60 * 60 * 24));
      const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, [dateStr]);
  return <span className="text-accent font-mono text-sm">{timeLeft}</span>;
}

export default function Landing() {
  const [siteContent, setSiteContent] = useState({});
  const [displayMembers, setDisplayMembers] = useState([]);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    apiFetch('/site-content').then(setSiteContent).catch(() => {});
    apiFetch('/display-members').then(setDisplayMembers).catch(() => {});
    apiFetch('/achievements').then(setAchievements).catch(() => {});
    apiFetch('/events').then(setEvents).catch(() => {});
    apiFetch('/resources').then(setResources).catch(() => {});
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('Sending...');
    try {
      await apiFetch('/contact', { method: 'POST', body: JSON.stringify(contactForm) });
      setContactStatus('Message sent!');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setContactStatus(''), 3000);
    } catch {
      setContactStatus('Error sending message');
    }
  };

  const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7 } };

  // Generate particles
  const particles = Array.from({ length: 30 }).map((_, i) => (
    <div key={i} className="particle" style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `${Math.random() * 5}s`
    }} />
  ));

  return (
    <div className="w-full relative overflow-hidden text-primary-var">

      {/* ── MINIMAL GLASSMORPHISM HERO ── */}
      <section ref={heroRef} className="relative min-h-screen pt-36 pb-20 mx-auto overflow-hidden flex items-center justify-center">
        
        {/* Wide Elegant 2-Column Split Panel matching your second alignment image */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }} 
          className="w-full relative z-10 flex items-center justify-center min-h-[60vh] px-6 md:px-12 lg:px-16"
        >
          <div className="relative w-full max-w-7xl mx-auto glass-minimal rounded-3xl p-8 md:p-16 lg:p-20 overflow-hidden transition-all duration-700 group">
            
            {/* Background geometric grid markers inside panel */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
              
              {/* Left Column: Premium Left-Aligned Swiss Editorial Typography */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Monochromatic Technical Category Pill */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 flex items-center space-x-2 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-main)] animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-text-main)]">
                    WE LEARN, WE SHARE
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, x: -30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-6xl md:text-[5.5rem] lg:text-[6.2rem] font-display font-black tracking-tight uppercase leading-[0.95] select-none text-[var(--color-text-main)]"
                >
                  ROBOTICS<br/><span className="text-[var(--color-text-muted)]">CLUB</span>
                </motion.h1>
                
                {/* Description Paragraph */}
                <motion.p
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-md md:text-lg text-muted-var font-light max-w-lg mt-6 leading-relaxed"
                >
                  Build cool robotics projects, lock in your team's ideas, and work on awesome hardware and software challenges.
                </motion.p>

                {/* Actions (Monochromatic Swiss Adaptive Buttons) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="z-10 flex flex-wrap gap-4 mt-10 items-center"
                >
                  <Link to="/forum">
                    <button className="px-8 py-4 rounded-full bg-[var(--color-primary)] text-[var(--color-base)] font-bold text-sm tracking-wider hover:opacity-90 transition-all shadow-md">
                      Explore Projects
                    </button>
                  </Link>
                  <a href="#about">
                    <button className="px-8 py-4 rounded-full border border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-[var(--color-text-main)] font-medium text-sm tracking-wider bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-all">
                      Learn More
                    </button>
                  </a>
                </motion.div>

              </div>

              {/* Right Column: Rotating Technical 3D Gyroscope/Globe */}
              <div className="lg:col-span-5 flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                >
                  <TechGyroscope />
                </motion.div>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* ── FEATURES BENTO GRID (Chic & Elegant Style) ── */}
      <section id="features" className="py-32 px-6 lg:px-16 max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (Chic Title & Motif) */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <span className="text-xs font-bold text-section-sub uppercase tracking-[0.25em] block mb-4">Build with Precision</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-section-heading uppercase leading-none tracking-tight">
                Features
              </h2>
              <p className="text-muted-var text-sm leading-relaxed mt-6 max-w-xs font-light">
                Build awesome robots and smart software with direct help from mentors, great resources, and cool team opportunities.
              </p>
            </div>
            <div className="mt-16 hidden lg:block">
              <span className="text-8xl font-light text-section-sub select-none">↗</span>
            </div>
          </div>

          {/* Right Bento Grid */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Cpu,
                title: "Cool Hardware",
                desc: "Get hands-on experience building real robots with parts like microcontrollers, motors, and sensors.",
                accent: "var(--color-border-hover)",
                accentText: "text-[var(--color-text-main)]"
              },
              {
                icon: GitBranch,
                title: "Smart Software",
                desc: "Learn to write code for robots, build AI models, computer vision systems, and simulator tools.",
                accent: "var(--color-border-hover)",
                accentText: "text-[var(--color-text-main)]"
              },
              {
                icon: Zap,
                title: "Lock Your Ideas",
                desc: "Pick from 50 unique projects, lock your choice with a team, and build a resume-ready project.",
                accent: "var(--color-border-hover)",
                accentText: "text-[var(--color-text-main)]"
              },
              {
                icon: Users,
                title: "Join a Team",
                desc: "Work in teams of 2 to 4 students with full support and guidance from experienced club mentors.",
                accent: "var(--color-border-hover)",
                accentText: "text-[var(--color-text-main)]"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Card className="p-8 rounded-2xl cursor-default flex flex-col justify-between min-h-[220px] h-full" hover={true}>
                  <div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6 border border-[var(--color-border)]" style={{ backgroundColor: f.accent }}>
                      <f.icon className={`w-5 h-5 ${f.accentText}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--feature-title)' }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed font-light" style={{ color: 'var(--feature-desc)' }}>{f.desc}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <span className="text-sm font-light select-none" style={{ color: 'var(--feature-arrow)' }}>↗</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24 px-6 relative noise-overlay border-y border-var bg-surface-var/20">
        <motion.div {...fadeUp} className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} className="h-[2px] mb-8 bg-accent" />
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-3xl font-display font-bold text-primary-var">About the Club</h2>
              </div>
              <p className="leading-relaxed mb-6 text-muted-var">
                {siteContent.about_text || 'The Robotics Club is an advanced engineering hub dedicated to solving real-world challenges through intelligent automation.'}
              </p>
              <p className="leading-relaxed text-muted-var">
                {siteContent.about_text_2 || 'We provide resources, mentorship, and environment to bring your vision to life.'}
              </p>
            </div>
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
              <Card glow className="flex items-start space-x-6 p-8 border-var bg-glass-bg">
                <div className="relative shrink-0">
                  <img src={siteContent.faculty_photo || 'https://i.pravatar.cc/150?u=faculty'} alt="Faculty" className="w-24 h-24 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-var" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full backdrop-blur-sm bg-accent border border-var animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-primary-var">{siteContent.faculty_name || 'Faculty Coordinator'}</h3>
                  <p className="text-sm mb-4 text-accent">{siteContent.faculty_title || 'Faculty Coordinator'}</p>
                  <div className="relative pl-4 border-l border-var">
                    <p className="text-sm italic leading-relaxed text-muted-var opacity-80">
                      "{siteContent.faculty_bio || 'Leading research in robotics and autonomous systems.'}"
                    </p>
                  </div>
                </div>
              </Card>
            </Tilt>
          </div>
        </motion.div>
      </section>

      {/* ── Team (3D Sliding Perspective Stack Carousel) ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[100px] pointer-events-none animate-float bg-glow-strong" />
        <motion.div {...fadeUp} className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} className="h-[2px] mx-auto mb-8 bg-accent" />
            <h2 className="text-4xl font-display font-extrabold mb-4 text-section-heading uppercase tracking-tight">Meet the Team</h2>
            <p className="text-section-sub max-w-xl mx-auto text-sm">The people driving robotics innovation at our core.</p>
          </div>
          
          <div className="relative w-full max-w-4xl mx-auto h-[440px] flex items-center justify-center">
            {displayMembers.length > 0 ? (
              <div className="stack-container">
                {displayMembers.map((m, idx) => {
                  let positionClass = "opacity-0 scale-75 pointer-events-none";
                  if (idx === activeTeamIdx) {
                    positionClass = "stack-card active";
                  } else if (idx === (activeTeamIdx - 1 + displayMembers.length) % displayMembers.length) {
                    positionClass = "stack-card left";
                  } else if (idx === (activeTeamIdx + 1) % displayMembers.length) {
                    positionClass = "stack-card right";
                  }

                  const isActive = idx === activeTeamIdx;

                  return (
                    <motion.div
                      key={m.id}
                      className={`w-80 ${positionClass}`}
                      onClick={() => setActiveTeamIdx(idx)}
                      drag={isActive ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(event, info) => {
                        if (!isActive) return;
                        if (info.offset.x < -60) {
                          // Dragged left -> slide to next card
                          setActiveTeamIdx((prev) => (prev + 1) % displayMembers.length);
                        } else if (info.offset.x > 60) {
                          // Dragged right -> slide to prev card
                          setActiveTeamIdx((prev) => (prev - 1 + displayMembers.length) % displayMembers.length);
                        }
                      }}
                    >
                      <div className="relative glass-premium rounded-3xl p-8 flex flex-col items-center text-center border border-[var(--color-border)] backdrop-blur-2xl select-none cursor-grab active:cursor-grabbing">
                        {/* Glowing active pill indicator */}
                        {idx === activeTeamIdx && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border border-[var(--color-border-hover)] bg-[var(--color-glow)] text-[9px] uppercase font-mono tracking-widest text-accent">
                            Swipe to Navigate
                          </div>
                        )}
                        <div className="w-28 h-28 rounded-full overflow-hidden mb-6 border-2 border-[var(--color-border)] pointer-events-none">
                          <img src={m.photo_url || 'https://i.pravatar.cc/200?u=' + m.id} alt={m.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-primary-var font-display tracking-wide pointer-events-none">{m.name}</h3>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-var font-mono mb-4 pointer-events-none">{m.role}</p>
                        <div className="w-full h-[1px] bg-[var(--color-border)] my-4 pointer-events-none" />
                        <span className="text-[10px] font-mono text-muted-var pointer-events-none">ROBOTICS COLLABORATOR</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-var w-full text-center">Loading team...</p>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 relative overflow-hidden border-y border-var bg-surface-var/30">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { val: siteContent.stat_projects || '24+', label: 'Deployed Projects' },
              { val: siteContent.stat_members || '150', label: 'Active Members' },
              { val: siteContent.stat_stacks || '6', label: 'Tech Stacks' },
              { val: siteContent.stat_wins || '5', label: 'Competition Wins' },
            ].map((s, i) => <StatCard key={i} val={s.val} label={s.label} delay={i * 0.1} />)}
          </div>
        </div>
      </section>

      {/* ── Events ── */}
      <section id="events" className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div {...fadeUp}>
          <div className="text-center mb-16">
            <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} className="h-[2px] mx-auto mb-8 bg-accent" />
            <h2 className="text-4xl font-display font-bold mb-4 text-primary-var">Upcoming Events</h2>
            <p className="text-muted-var">Workshops, hackathons, and guest lectures.</p>
          </div>
          <div className="relative ml-4 md:ml-12 space-y-8 pb-8">
            <motion.div initial={{ height: 0 }} whileInView={{ height: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5 }}
              className="absolute left-0 top-0 w-[1px] bg-gradient-to-b from-accent via-[var(--color-border)] to-transparent" />
            {events.length > 0 ? events.map((ev, i) => (
              <motion.div key={ev.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative pl-8 md:pl-12">
                <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] rounded-full ring-4 ring-offset-2 bg-accent ring-border-var ring-offset-base-var" />
                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3}>
                  <Card className="p-6 border-var bg-glass-bg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold tracking-widest uppercase text-muted-var font-mono">{ev.date} {ev.type && `/ ${ev.type}`}</span>
                      <EventCountdown dateStr={ev.date} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-primary-var">{ev.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-var opacity-90">{ev.description}</p>
                  </Card>
                </Tilt>
              </motion.div>
            )) : <div className="pl-8 text-sm text-muted-var">No upcoming events.</div>}
          </div>
        </motion.div>
      </section>

      {/* ── Contact ── */}
      <section className="py-32 px-6 max-w-3xl mx-auto relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full blur-[120px] bg-glow" />
        </div>
        <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2}>
          <Card glow className="p-8 md:p-12 text-center relative z-10 border-var bg-panel-var/80 backdrop-blur-xl">
            <h2 className="text-3xl font-display font-bold mb-2 text-primary-var">Contact Us</h2>
            <p className="mb-8 max-w-md mx-auto text-muted-var">Have a question or want to sponsor us? Reach out directly.</p>
            
            <form className="flex flex-col gap-4 text-left" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" required value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border border-var bg-input-bg text-primary-var focus:border-accent" />
                <input type="email" placeholder="Email" required value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border border-var bg-input-bg text-primary-var focus:border-accent" />
              </div>
              <input type="text" placeholder="Subject" required value={contactForm.subject} onChange={e=>setContactForm({...contactForm,subject:e.target.value})}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border border-var bg-input-bg text-primary-var focus:border-accent" />
              <textarea placeholder="Message" required rows="4" value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border border-var bg-input-bg text-primary-var focus:border-accent resize-none" />
              <Button type="submit" variant="primary" className="w-full mt-2 group relative overflow-hidden">
                <span className="relative z-10 font-bold tracking-wide">Send Message</span>
              </Button>
              {contactStatus && <p className="text-accent text-center mt-2 text-sm font-bold">{contactStatus}</p>}
            </form>
          </Card>
        </Tilt>
      </section>
    </div>
  );
}
