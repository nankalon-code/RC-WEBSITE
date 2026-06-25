import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

const ROLES = ['All', 'Core Team', 'Hardware', 'Software', 'Outreach'];

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState('All');
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    apiFetch('/display-members')
      .then(d => { setMembers(d || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeRole === 'All'
    ? members
    : members.filter(m => m.role?.toLowerCase().includes(activeRole.toLowerCase()));

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative text-primary-var">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)' }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-var font-mono block mb-4">THE CREW</span>
            <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight leading-none">
              Meet the<br /><span className="text-muted-var">Team.</span>
            </h1>
            <p className="text-muted-var mt-4 max-w-md leading-relaxed">
              The people turning ideas into robots. Builders, tinkerers, and the occasional philosopher.
            </p>
          </div>


        </div>

        {/* Role filters */}
        <div className="flex flex-wrap gap-2 mt-10">
          {ROLES.map(role => (
            <button key={role} onClick={() => setActiveRole(role)}
              className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 border"
              style={{
                borderColor: activeRole === role ? 'var(--color-border-hover)' : 'var(--color-border)',
                background: activeRole === role ? 'var(--color-surface-2)' : 'transparent',
                color: activeRole === role ? 'var(--color-text-main)' : 'var(--color-text-muted)',
              }}>
              {role}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Team grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-var animate-pulse"
              style={{ height: 260, background: 'var(--color-surface)' }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id} layout
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              onHoverStart={() => setHovered(m.id)} onHoverEnd={() => setHovered(null)}
              className="relative rounded-2xl overflow-hidden border cursor-default group"
              style={{ borderColor: hovered === m.id ? 'var(--color-border-hover)' : 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              {/* Photo */}
              <div className="aspect-square overflow-hidden bg-black">
                <img src={m.photo_url || `https://i.pravatar.cc/300?u=${m.id}`}
                  alt={m.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-sm text-primary-var truncate">{m.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-muted-var font-mono mt-0.5 truncate">{m.role}</p>
              </div>

              {/* Hover accent line top */}
              <motion.div className="absolute top-0 left-0 right-0 h-px bg-white/30"
                initial={{ scaleX: 0 }} animate={{ scaleX: hovered === m.id ? 1 : 0 }}
                transition={{ duration: 0.25 }} style={{ transformOrigin: 'left' }} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-32 text-muted-var">
          <p className="text-lg font-light">No members in this category yet.</p>
        </div>
      )}

      {/* Bottom count */}
      {!loading && filtered.length > 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-muted-var text-xs font-mono tracking-widest uppercase mt-16">
          {filtered.length} member{filtered.length !== 1 ? 's' : ''} {activeRole !== 'All' ? `in ${activeRole}` : 'total'}
        </motion.p>
      )}
    </div>
  );
}
