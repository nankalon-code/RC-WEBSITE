import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForumStore } from '../store/forumStore';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Forum() {
  const { ideas, lockIdea, fetchIdeas } = useForumStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [teamName, setTeamName] = useState('');
  
  // Dynamic structured members (2 to 4)
  const [members, setMembers] = useState([
    { name: '', email: '', student_id: '', branch: '', github: '', linkedin: '' },
    { name: '', email: '', student_id: '', branch: '', github: '', linkedin: '' }
  ]);
  
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const filtered = ideas.filter((idea) => {
    const matchFilter = 
      filter === 'All' || 
      idea.category === filter ||
      (filter === 'Available' && idea.status === 'available') ||
      (filter === 'Taken' && idea.status === 'locked');
      
    const matchSearch =
      !search ||
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description.toLowerCase().includes(search.toLowerCase()) ||
      (idea.tech_stack || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (selectedIdea) {
      const validMembers = members.filter(m => m.email.trim() !== '');
      if (validMembers.length < 2 || validMembers.length > 4) {
          alert("Please provide 2 to 4 members.");
          return;
      }
      const success = await lockIdea(selectedIdea.id, { teamName, members: validMembers });
      if (success) {
        setSelectedIdea(null);
        setTeamName('');
        setMembers([
          { name: '', email: '', student_id: '', branch: '', github: '', linkedin: '' },
          { name: '', email: '', student_id: '', branch: '', github: '', linkedin: '' }
        ]);
      }
    }
  };
  
  const addMemberField = () => {
      if (members.length < 4) {
          setMembers([...members, { name: '', email: '', student_id: '', branch: '', github: '', linkedin: '' }]);
      }
  };

  const removeMemberField = (index) => {
      if (members.length > 2) {
          setMembers(members.filter((_, i) => i !== index));
      }
  };

  const updateMember = (index, field, value) => {
      const newMembers = [...members];
      newMembers[index][field] = value;
      setMembers(newMembers);
  };

  const categoryColor = (cat) => {
    switch (cat) {
      case 'Hardware': return 'bg-[var(--glass-bg-hover)] text-[var(--color-text-main)] border-[var(--color-border-hover)]';
      case 'Software': return 'bg-[var(--glass-bg-hover)] text-[var(--color-text-main)] border-[var(--color-border-hover)]';
      default: return 'bg-[var(--glass-bg)] text-[var(--color-text-muted)] border-[var(--color-border)]';
    }
  };

  return (
    <div className="rc-forum-section">
      <div className="rc-forum-inner">
        {/* Header */}
        <div className="rc-forum-header">
          <div className="rc-forum-title-wrap">
            <div className="rc-forum-tag">
              003 / 006 <span className="rc-forum-tag-sec">· PROJECT FORUM</span>
            </div>
            <h1 className="rc-forum-title">
              {ideas.length} robotics projects. <em>Lock yours.</em>
            </h1>
            <p className="rc-forum-desc">
              Browse, filter and reserve a build. Each idea can be locked by one team — first come, first served.
            </p>
          </div>

          <div className="rc-forum-stats">
            <div className="rc-forum-stat-card">
              <span className="rc-forum-stat-key">TOTAL</span>
              <span className="rc-forum-stat-val">{ideas.length}</span>
            </div>
            <div className="rc-forum-stat-card">
              <span className="rc-forum-stat-key">AVAILABLE</span>
              <span className="rc-forum-stat-val">
                {ideas.filter((i) => i.status === 'available').length}
              </span>
            </div>
            <div className="rc-forum-stat-card">
              <span className="rc-forum-stat-key">LOCKED</span>
              <span className="rc-forum-stat-val locked">
                {ideas.filter((i) => i.status === 'locked').length}
              </span>
            </div>
          </div>
        </div>

        {/* Controls (Filters + Search) */}
        <div className="rc-forum-controls">
          <div className="rc-forum-filters">
            {['All', 'Hardware', 'Software', 'IoT', 'Available', 'Taken'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rc-forum-filter-btn ${filter === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, tags..."
            className="rc-forum-search"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((idea, index) => {
            const isLocked = idea.status === 'locked';
            const ideaIndex = String(index + 1).padStart(2, '0');
            const techTags = idea.tech_stack ? idea.tech_stack.split(',').map((t) => t.trim()) : [];

            return (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 3) * 0.05, duration: 0.5 }}
                className="relative"
              >
                <div className="rc-forum-card">
                  <div className="rc-forum-card-top">
                    <span className="rc-forum-card-category">
                      <span className="rc-forum-card-index">#{ideaIndex}</span> · {idea.category}
                    </span>
                    <span className="rc-forum-card-status">
                      <span className={`rc-forum-card-dot ${isLocked ? 'locked' : 'open'}`} />
                      {isLocked ? 'Locked' : 'Open'}
                    </span>
                  </div>

                  <h3 className="rc-forum-card-title">{idea.title}</h3>
                  <p className="rc-forum-card-desc">{idea.description}</p>

                  {techTags.length > 0 && (
                    <div className="rc-forum-card-tags">
                      {techTags.map((tag, ti) => (
                        <span key={ti} className="rc-forum-card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="rc-forum-card-footer">
                    <span className="rc-forum-card-diff">{idea.difficulty}</span>
                    {isLocked ? (
                      <span className="rc-forum-card-team">Team: {idea.locked_by_team}</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            setSelectedIdea(idea);
                          } else {
                            navigate('/login');
                          }
                        }}
                        className="rc-forum-card-btn"
                      >
                        Lock idea &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-var text-sm mt-12">No projects match your search.</p>
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedIdea && (
          <div data-lenis-prevent className="fixed inset-0 z-[100] overflow-y-auto flex items-start justify-center py-12 px-4 scrollbar-thin">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setSelectedIdea(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl bg-panel-var border border-var rounded-2xl p-6 sm:p-8 shadow-2xl z-10 md:my-auto my-4"
              data-lenis-prevent
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff3b30] to-transparent" />

              <h2 className="text-2xl font-display font-bold mb-2 text-primary-var">
                {selectedIdea.title}
              </h2>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-var">
                  {selectedIdea.category}
                </span>
                <span className="text-xs text-muted-var font-bold uppercase tracking-widest">
                  {selectedIdea.difficulty}
                </span>
              </div>

              <p className="text-muted-var text-sm leading-relaxed mb-3">
                {selectedIdea.description}
              </p>

              <div className="border-t border-var pt-6 mt-4">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-var tracking-widest uppercase">
                      Team Name
                    </label>
                    <input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      type="text"
                      className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-sm outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                      placeholder="Your team name"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-muted-var tracking-widest uppercase">
                        Team Members (2-4)
                      </label>
                      {members.length < 4 && (
                        <button type="button" onClick={addMemberField} className="text-xs text-accent hover:underline">
                          + Add Member
                        </button>
                      )}
                    </div>

                    {members.map((m, i) => (
                      <div key={i} className="p-4 bg-surface-var border border-var rounded-xl space-y-3 relative">
                        <div className="flex justify-between items-center border-b border-var pb-2">
                          <span className="text-xs font-bold text-accent uppercase tracking-wider">Member #{i + 1}</span>
                          {members.length > 2 && (
                            <button type="button" onClick={() => removeMemberField(i)} className="text-red-500 hover:text-red-400 text-xs">
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Name</label>
                            <input required type="text" placeholder="Full Name" value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Email</label>
                            <input required type="email" placeholder="email@address.com" value={m.email} onChange={(e) => updateMember(i, 'email', e.target.value)} className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Roll Number</label>
                            <input required type="text" placeholder="Roll / Student ID" value={m.student_id} onChange={(e) => updateMember(i, 'student_id', e.target.value)} className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Branch</label>
                            <input required type="text" placeholder="e.g. CSE, ECE, Robotics" value={m.branch} onChange={(e) => updateMember(i, 'branch', e.target.value)} className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">GitHub Profile</label>
                            <input required type="url" placeholder="https://github.com/..." value={m.github} onChange={(e) => updateMember(i, 'github', e.target.value)} className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">LinkedIn Profile</label>
                            <input required type="url" placeholder="https://linkedin.com/in/..." value={m.linkedin} onChange={(e) => updateMember(i, 'linkedin', e.target.value)} className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-primary-var hover:bg-glass-bg"
                      onClick={() => setSelectedIdea(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      Register & Lock
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
