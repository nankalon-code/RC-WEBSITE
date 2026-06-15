import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/achievements')
      .then((data) => {
        setAchievements(data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Static list for perfect match to mockup, merged with any backend data if present
  const staticAchievements = [
    { year: '2026', title: '1st place — IIT Madras Robowars', category: 'SUMO CLASS - IRONCLAD TEAM' },
    { year: '2025', title: 'Finalist — DRDO Drone Challenge', category: 'AUTONOMOUS PAYLOAD DELIVERY' },
    { year: '2025', title: 'Best Design — TechFest Mumbai', category: 'AXIS-7 MANIPULATOR DEMO' },
    { year: '2024', title: 'Top 10 — Smart India Hackathon', category: 'AGRI-IOT TRACK' },
    { year: '2023', title: 'Gold — National Line-Follower', category: 'SUB-30S LAP RECORD' },
    { year: '2022', title: 'Founded clean-room facility', category: 'WORKSHOP EXPANSION' }
  ];

  const displayList = achievements.length > 0 
    ? achievements.map(a => ({
        year: a.date ? new Date(a.date).getFullYear().toString() : '2026',
        title: a.title,
        category: a.category ? a.category.toUpperCase() : 'PROJECT RECORD'
      }))
    : staticAchievements;

  return (
    <div className="rc-root">
      <section className="rc-page-section">
        <div className="rc-section-inner">
          {/* Header */}
          <div className="rc-page-header">
            <span className="rc-tag-sub uppercase tracking-[0.25em] text-red-500 font-mono block mb-2">ACHIEVEMENTS</span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-black tracking-tight leading-none">
              Trophies and broken prototypes.
            </h1>
          </div>

          {/* List Rows */}
          <div className="rc-achievements-list">
            {displayList.map((ach, i) => (
              <motion.div
                key={i}
                className="rc-achievement-row"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="rc-ach-year">{ach.year}</div>
                <div className="rc-ach-title">{ach.title}</div>
                <div className="rc-ach-category">{ach.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
