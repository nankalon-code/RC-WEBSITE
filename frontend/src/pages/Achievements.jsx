import { useState } from 'react';
import { motion } from 'framer-motion';

const ACHIEVEMENTS = [
  {
    sno: 1,
    institution: 'Manipal University, Jaipur',
    fest: "ELICIT '25",
    category: 'Robo Soccer',
    participants: 10,
    achievement: 'Participated',
    highlight: false,
  },
  {
    sno: 2,
    institution: 'LNMIT, Jaipur',
    fest: 'Plinth',
    category: 'Robo Race, Robo Soccer',
    participants: 6,
    achievement: '1st Runner Up at Robo Soccer',
    highlight: true,
  },
  {
    sno: 3,
    institution: 'JECRC Foundation, Jaipur',
    fest: "Renaissance'26",
    category: 'Robo Soccer',
    participants: 2,
    achievement: 'Participated',
    highlight: false,
  },
  {
    sno: 4,
    institution: 'JECRC University, Jaipur',
    fest: "Rhythm'26",
    category: 'Robo Race, Robo Soccer, Robo War',
    participants: 3,
    achievement: '1st Runner Up at Robo War; 2nd Runner Up at Robo Soccer',
    highlight: true,
  },
  {
    sno: 5,
    institution: 'NMIMS University, Indore',
    fest: 'Ranbhoomi',
    category: 'Robo Soccer, Robo Sumo',
    participants: 1,
    achievement: '1st Runner Up',
    highlight: true,
  },
  {
    sno: 6,
    institution: 'BML University, Gurgaon',
    fest: '67th Milestone Heroes Challenge',
    category: 'Robo Soccer, Robo Race, Robo Sumo',
    participants: 2,
    achievement: '2nd Runner Up at Robo Soccer',
    highlight: true,
  },
  {
    sno: 7,
    institution: 'JIET, Jodhpur',
    fest: 'Rec-kon 6.0',
    category: 'Hackathon',
    participants: 4,
    achievement: 'Participated',
    highlight: false,
  },
  {
    sno: 8,
    institution: 'Shankar Institute of Education, Jaipur',
    fest: 'Shankara Hackathon',
    category: 'Hackathon',
    participants: 15,
    achievement: 'Winner',
    highlight: true,
  },
];

const STATS = [
  { val: '8', label: 'Total Competitions' },
  { val: '6', label: 'Podium Finishes' },
  { val: '20', label: 'Students Participated' },
  { val: '5', label: 'Cities Visited' },
];

export default function Achievements() {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="rc-root">
      <section className="rc-page-section">
        <div className="rc-section-inner">
          {/* Header */}
          <div className="rc-page-header">
            <span className="rc-tag-sub uppercase tracking-[0.25em] text-red-500 font-mono block mb-2">ACHIEVEMENTS</span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-black tracking-tight leading-none" style={{ color: 'var(--color-text-main)' }}>
              Trophies and broken prototypes.
            </h1>
            <p className="mt-4 text-lg" style={{ color: 'var(--color-text-muted)' }}>
              A record of every competition the club has entered — from robo wars to hackathons.
            </p>
          </div>

          {/* Table */}
          <div className="rc-ach-table-wrap">
            {/* Table Header */}
            <div className="rc-ach-table-header">
              <span className="rc-ach-col rc-ach-col-sno">S.No.</span>
              <span className="rc-ach-col rc-ach-col-inst">Institution</span>
              <span className="rc-ach-col rc-ach-col-fest">Fest / Event</span>
              <span className="rc-ach-col rc-ach-col-cat">Category</span>
              <span className="rc-ach-col rc-ach-col-part">Participants</span>
              <span className="rc-ach-col rc-ach-col-ach">Achievement</span>
            </div>

            {/* Rows */}
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.sno}
                className={`rc-ach-table-row ${hoveredRow === i ? 'rc-ach-row-hovered' : ''}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <span className="rc-ach-col rc-ach-col-sno rc-ach-cell-sno">{ach.sno}</span>
                <span className="rc-ach-col rc-ach-col-inst rc-ach-cell-inst">{ach.institution}</span>
                <span className="rc-ach-col rc-ach-col-fest rc-ach-cell-fest">{ach.fest}</span>
                <span className="rc-ach-col rc-ach-col-cat rc-ach-cell-cat">{ach.category}</span>
                <span className="rc-ach-col rc-ach-col-part rc-ach-cell-part">{ach.participants}</span>
                <span className={`rc-ach-col rc-ach-col-ach rc-ach-cell-ach ${ach.highlight ? 'rc-ach-highlight' : ''}`}>
                  {ach.achievement}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div
            className="rc-ach-stats-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {STATS.map((s, i) => (
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
