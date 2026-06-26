import { motion } from 'framer-motion';

const ACHIEVEMENTS = [
  {
    year: '2026',
    title: 'Shankara Hackathon — Shankar Institute of Education, Jaipur',
    category: 'WINNER · HACKATHON',
    highlight: true,
  },
  {
    year: '2026',
    title: "Rhythm'26 — JECRC University, Jaipur",
    category: '1ST RUNNER UP ROBO WAR · 2ND RUNNER UP ROBO SOCCER',
    highlight: true,
  },
  {
    year: '2026',
    title: 'Ranbhoomi — NMIMS University, Indore',
    category: '1ST RUNNER UP · ROBO SOCCER & SUMO',
    highlight: true,
  },
  {
    year: '2026',
    title: '67th Milestone Heroes Challenge — BML University, Gurgaon',
    category: '2ND RUNNER UP AT ROBO SOCCER',
    highlight: true,
  },
  {
    year: '2025',
    title: 'Plinth — LNMIT, Jaipur',
    category: '1ST RUNNER UP AT ROBO SOCCER',
    highlight: true,
  },
  {
    year: '2025',
    title: 'JERCE University Fest',
    category: 'WINNER ROBO RUSH · SEMI-FINALIST ROBO SOCCER',
    highlight: true,
  },
  {
    year: '2025',
    title: 'JERCE Foundation Fest',
    category: 'SEMI-FINALIST · TUG OF WAR',
    highlight: true,
  },
  {
    year: '2025',
    title: 'Shankara Hackathon',
    category: '2ND POSITION · TEAM "HYDRO BOT" (WATER SURFACE CLEANING BOT)',
    highlight: true,
  },
];

export default function Achievements() {
  return (
    <div className="rc-root">
      <section className="rc-page-section">
        <div className="rc-section-inner">
          {/* Header */}
          <div className="rc-page-header">
            <span className="rc-tag-sub uppercase tracking-[0.25em] text-red-500 font-mono block mb-2">ACHIEVEMENTS</span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-none" style={{ color: 'var(--color-text-main)' }}>
              Trophies and broken prototypes.
            </h1>
          </div>

          {/* List Rows */}
          <div className="rc-achievements-list">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={i}
                className="rc-achievement-row"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="rc-ach-year">{ach.year}</div>
                <div className={`rc-ach-title ${ach.highlight ? 'rc-ach-title-highlight' : ''}`}>{ach.title}</div>
                <div className={`rc-ach-category ${ach.highlight ? 'rc-ach-cat-highlight' : ''}`}>{ach.category}</div>
              </motion.div>
            ))}
          </div>

          {/* Stats bar */}
          <motion.div
            className="rc-ach-stats-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              { val: '8', label: 'Total Competitions' },
              { val: '6', label: 'Podium Finishes' },
              { val: '5', label: 'Cities Visited' },
            ].map((s, i) => (
              <div key={i} className="rc-ach-stat-item">
                <span className="rc-ach-stat-val">{s.val}</span>
                <span className="rc-ach-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
