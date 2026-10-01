import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForumStore } from '../store/forumStore';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Forum() {
  const { ideas, lockIdea, fetchIdeas } = useForumStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dynamic structured members (1 to 4)
  const [members, setMembers] = useState([
    { name: '', email: '', student_id: '', branch: '', github: '', linkedin: '' }
  ]);
  
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  useEffect(() => {
    if (selectedIdea) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIdea]);

  const openLockModal = (idea) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedIdea(idea);
    setTeamName('');
    setError('');
    // Auto-fill member 1 with current user details if available
    setMembers([
      {
        name: user?.name || '',
        email: user?.email || '',
        student_id: user?.student_id || '',
        branch: '',
        github: user?.github_url || '',
        linkedin: user?.linkedin_url || ''
      }
    ]);
  };

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
    setError('');

    if (!selectedIdea) return;

    if (!teamName.trim()) {
      setError('Please provide a team or project name.');
      return;
    }

    const validMembers = members.filter(m => m.email.trim() !== '' && m.name.trim() !== '');
    if (validMembers.length < 1 || validMembers.length > 4) {
      setError('Please provide at least 1 valid member with Name and Email (max 4).');
      return;
    }

    setLoading(true);
    try {
      const res = await lockIdea(selectedIdea.id, {
        teamName: teamName.trim(),
        members: validMembers.map(m => ({
          name: m.name.trim(),
          email: m.email.trim(),
          student_id: m.student_id ? m.student_id.trim() : null,
          branch: m.branch ? m.branch.trim() : null,
          github: m.github ? m.github.trim() : null,
          linkedin: m.linkedin ? m.linkedin.trim() : null,
        }))
      });

      if (res.success) {
        setSelectedIdea(null);
        setTeamName('');
        setError('');
        fetchIdeas();
      } else {
        setError(res.error || 'Failed to lock idea. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while locking this idea.');
    } finally {
      setLoading(false);
    }
  };
  
  const addMemberField = () => {
    if (members.length < 4) {
      setMembers([...members, { name: '', email: '', student_id: '', branch: '', github: '', linkedin: '' }]);
    }
  };

  const removeMemberField = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  return (
    <div className="rc-forum-section">
      <div className="rc-forum-inner">
        {/* Header */}
        <div className="rc-forum-header">
          <div className="rc-forum-title-wrap">
            <div className="rc-forum-tag">
              003 / 006 <span className="rc-forum-tag-sec">PROJECT FORUM</span>
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
                      <span className="rc-forum-card-index">#{ideaIndex}</span> {idea.category}
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
                        onClick={() => openLockModal(idea)}
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
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedIdea && (
              <div
                data-lenis-prevent
                className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 sm:p-6"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                  onClick={() => !loading && setSelectedIdea(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-panel-var border border-var rounded-2xl p-6 sm:p-8 shadow-2xl z-10 my-auto scrollbar-thin"
                  data-lenis-prevent
                >
                  <button
                    type="button"
                    onClick={() => !loading && setSelectedIdea(null)}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-var hover:text-primary-var w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors z-20 cursor-pointer text-sm"
                    title="Close modal"
                  >
                    ✕
                  </button>
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

              <p className="text-muted-var text-sm leading-relaxed mb-4">
                {selectedIdea.description}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="border-t border-var pt-5 mt-2">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-var tracking-widest uppercase">
                      Team / Project Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      type="text"
                      className="w-full bg-input-bg border border-var rounded-xl px-4 py-2.5 text-sm outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                      placeholder="e.g. Apex Robotics, Autonomous Rover Alpha"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-muted-var tracking-widest uppercase">
                        Team Members (1–4)
                      </label>
                      {members.length < 4 && (
                        <button type="button" onClick={addMemberField} className="text-xs text-accent hover:underline font-medium">
                          + Add Teammate
                        </button>
                      )}
                    </div>

                    {members.map((m, i) => (
                      <div key={i} className="p-4 bg-surface-var border border-var rounded-xl space-y-3 relative">
                        <div className="flex justify-between items-center border-b border-var pb-2">
                          <span className="text-xs font-bold text-accent uppercase tracking-wider">
                            Member #{i + 1} {i === 0 && <span className="text-muted-var font-normal text-[11px]">(Lead / Submitter)</span>}
                          </span>
                          {members.length > 1 && (
                            <button type="button" onClick={() => removeMemberField(i)} className="text-red-500 hover:text-red-400 text-xs font-medium">
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">
                              Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              placeholder="Full Name"
                              value={m.name}
                              onChange={(e) => updateMember(i, 'name', e.target.value)}
                              className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">
                              Email <span className="text-red-400">*</span>
                            </label>
                            <input
                              required
                              type="email"
                              placeholder="email@address.com"
                              value={m.email}
                              onChange={(e) => updateMember(i, 'email', e.target.value)}
                              className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Roll / Student ID (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. 21UCSE042"
                              value={m.student_id}
                              onChange={(e) => updateMember(i, 'student_id', e.target.value)}
                              className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Branch / Dept (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. CSE, ECE, Robotics"
                              value={m.branch}
                              onChange={(e) => updateMember(i, 'branch', e.target.value)}
                              className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">GitHub Profile (Optional)</label>
                            <input
                              type="text"
                              placeholder="github.com/username"
                              value={m.github}
                              onChange={(e) => updateMember(i, 'github', e.target.value)}
                              className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">LinkedIn Profile (Optional)</label>
                            <input
                              type="text"
                              placeholder="linkedin.com/in/username"
                              value={m.linkedin}
                              onChange={(e) => updateMember(i, 'linkedin', e.target.value)}
                              className="w-full bg-input-bg border border-var rounded-lg px-3 py-2 text-xs outline-none text-primary-var focus:border-[var(--color-border-hover)] focus:ring-1 focus:ring-[var(--color-border-hover)]/20 transition-all placeholder-zinc-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-primary-var hover:bg-glass-bg"
                      onClick={() => setSelectedIdea(null)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                      {loading ? 'Registering & Locking...' : 'Register & Lock Idea'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
}
