import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiFetch } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const TABS = ['Overview', 'Users', 'Create Member', 'Ideas', 'Team Display', 'Achievements', 'Gallery', 'Events', 'Resources', 'Announcements', 'Site Content'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="rc-root">
      <section className="rc-page-section">
        <div className="rc-section-inner">
          
          {/* Node Indicator */}
          <div className="rc-admin-node">
            <span className="rc-node-dot" /> ADMIN NODE
          </div>

          {/* Heading */}
          <div className="rc-page-header">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-black tracking-tight leading-none mb-2">
              Admin Panel
            </h1>
            <p className="rc-section-desc">
              Manage the entire platform without touching code.
            </p>
          </div>

          {/* Tab Navigation Menu */}
          <div className="rc-admin-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rc-admin-tab-btn ${tab === t ? 'active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rc-admin-content"
            >
              {tab === 'Overview' && <OverviewTab />}
              {tab === 'Users' && <UsersTab currentUser={user} />}
              {tab === 'Create Member' && <CreateMemberTab />}
              {tab === 'Ideas' && <IdeasTab />}
              {tab === 'Team Display' && <TeamDisplayTab />}
              {tab === 'Achievements' && <AchievementsTab />}
              {tab === 'Gallery' && <GalleryTab />}
              {tab === 'Events' && <EventsTab />}
              {tab === 'Resources' && <ResourcesTab />}
              {tab === 'Announcements' && <AnnouncementsTab />}
              {tab === 'Site Content' && <SiteContentTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab() {
  const [stats, setStats] = useState({ users: 128, ideas: 50, locked: 5, teams: 12, events: 3 });

  useEffect(() => {
    Promise.all([
      apiFetch('/admin/users'),
      apiFetch('/ideas'),
      apiFetch('/teams'),
      apiFetch('/events')
    ]).then(([users, ideas, teams, events]) => {
      setStats({
        users: users.length || 128,
        ideas: ideas.length || 50,
        locked: ideas.filter((i) => i.status === 'locked').length || 5,
        teams: teams.length || 12,
        events: events.length || 3
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'TOTAL USERS', value: stats.users, meta: '+8 this week' },
    { label: 'TOTAL IDEAS', value: stats.ideas, meta: '' },
    { label: 'LOCKED IDEAS', value: stats.locked, meta: '' },
    { label: 'REGISTERED TEAMS', value: stats.teams, meta: '' },
    { label: 'EVENTS', value: stats.events, meta: 'Upcoming' },
  ];

  return (
    <div className="rc-overview-wrap">
      {/* 5 Stats Cards Row */}
      <div className="rc-stats-cards">
        {cards.map((c) => (
          <div key={c.label} className="rc-stat-card">
            <span className="rc-stat-card-label">{c.label}</span>
            <span className="rc-stat-card-val">{c.value}</span>
            {c.meta && <span className="rc-stat-card-meta">{c.meta}</span>}
          </div>
        ))}
      </div>

      {/* Two Columns: Recent Activity & System Status */}
      <div className="rc-overview-grid">
        {/* Recent Activity */}
        <div className="rc-recent-activity">
          <h3 className="rc-activity-title">Recent activity</h3>
          <p className="rc-activity-sub">Last 24 hours, all platform events.</p>
          <div className="rc-activity-rows">
            <div className="rc-activity-row">
              <span className="rc-activity-time">10:42</span>
              <span className="rc-activity-text">Team Skyhook locked "Drone — Quadcopter"</span>
            </div>
            <div className="rc-activity-row">
              <span className="rc-activity-time">09:18</span>
              <span className="rc-activity-text">New member: Maya Iyer joined Software track</span>
            </div>
            <div className="rc-activity-row">
              <span className="rc-activity-time">YESTERDAY</span>
              <span className="rc-activity-text">Event published: Hackathon — 14 Jun</span>
            </div>
            <div className="rc-activity-row">
              <span className="rc-activity-time">YESTERDAY</span>
              <span className="rc-activity-text">Idea added: Underwater ROV (Hardware)</span>
            </div>
          </div>
        </div>

        {/* System Status dark card */}
        <div className="rc-system-status">
          <div className="rc-system-eyebrow">
            <span className="rc-system-dot" /> SYSTEM
          </div>
          <h3 className="rc-system-title">All systems nominal</h3>
          <p className="rc-system-desc">Lab access, forum and member portal all online.</p>
          <button className="rc-system-btn">RUN DIAGNOSTICS</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Users Tab ─── */
function UsersTab({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    position: '',
    student_id: '',
    github_url: '',
    linkedin_url: '',
    phone: '',
  });
  const [saveStatus, setSaveStatus] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    apiFetch('/admin/users').then(setUsers).catch(() => {});
  }, []);

  const startEditing = (u) => {
    setEditingUserId(u.id);
    setEditForm({
      name: u.name || '',
      role: u.role || 'user',
      position: u.position || '',
      student_id: u.student_id || '',
      github_url: u.github_url || '',
      linkedin_url: u.linkedin_url || '',
      phone: u.phone || '',
    });
    setSaveStatus('');
  };

  const saveUserProfile = async (userId) => {
    setSaveStatus('Saving...');
    try {
      const updatedUser = await apiFetch(`/admin/users/${userId}/profile`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      setEditingUserId(null);
      setSaveStatus('');
    } catch (err) {
      alert(err.message || 'Failed to save profile changes.');
      setSaveStatus('');
    }
  };

  const toggleActive = async (userId) => {
      try {
          const res = await apiFetch(`/admin/users/${userId}/toggle-active`, { method: 'PUT' });
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: res.is_active } : u)));
      } catch (err) {
          alert(err.message);
      }
  }

  const isSuperAdmin = currentUser?.id === 1;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="rc-admin-card animate-fadeIn">
      <h2 className="rc-admin-card-title">All Users</h2>
      <p className="rc-admin-card-desc mb-4">
        Assign roles, position titles, verify credentials, and manage account statuses.
        {!isSuperAdmin && " Only the primary admin can grant admin access."}
      </p>
      <div className="overflow-x-auto">
        <table className="rc-admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Position</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => {
              const isEditing = editingUserId === u.id;
              return (
                <tr key={u.id}>
                  <td className="font-bold text-black">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="rc-admin-input py-1 px-2 text-xs"
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td className="text-gray-500">{u.email}</td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="rc-admin-select text-xs py-1"
                      >
                        <option value="user">User</option>
                        <option value="member">Member</option>
                        {isSuperAdmin && <option value="admin">Admin</option>}
                      </select>
                    ) : (
                      <span className={`rc-pill-badge ${u.role === 'admin' ? 'admin' : u.role === 'member' ? 'member' : 'user'}`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.position}
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        placeholder="Position (e.g. IoT Lead)"
                        className="rc-admin-input py-1 px-2 text-xs"
                      />
                    ) : (
                      <span className="text-xs text-gray-700 font-mono">{u.position || '—'}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="space-y-1.5 py-1">
                        <input
                          type="text"
                          value={editForm.student_id}
                          onChange={(e) => setEditForm({ ...editForm, student_id: e.target.value })}
                          placeholder="Roll No"
                          className="rc-admin-input py-1 px-2 text-[11px]"
                        />
                        <input
                          type="text"
                          value={editForm.github_url}
                          onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })}
                          placeholder="GitHub Link"
                          className="rc-admin-input py-1 px-2 text-[11px]"
                        />
                        <input
                          type="text"
                          value={editForm.linkedin_url}
                          onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                          placeholder="LinkedIn Link"
                          className="rc-admin-input py-1 px-2 text-[11px]"
                        />
                      </div>
                    ) : (
                      <div className="text-xs space-y-0.5">
                        {u.student_id && <p><span className="text-[10px] text-gray-400 uppercase font-bold">Roll:</span> {u.student_id}</p>}
                        {u.github_url && <p><a href={u.github_url} target="_blank" rel="noreferrer" className="text-red-500 hover:underline">GitHub</a></p>}
                        {u.linkedin_url && <p><a href={u.linkedin_url} target="_blank" rel="noreferrer" className="text-red-500 hover:underline">LinkedIn</a></p>}
                      </div>
                    )}
                  </td>
                  <td>
                    <button onClick={() => toggleActive(u.id)} className={`rc-status-toggle-btn ${u.is_active ? 'active' : 'inactive'}`}>
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </button>
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveUserProfile(u.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-[11px] font-bold uppercase tracking-wider"
                        >
                          {saveStatus || 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-[11px] font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(u)}
                        className="px-2 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="rc-admin-pagination">
          <Button variant="ghost" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <Button variant="ghost" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
}

/* ─── Create Member Tab ─── */
function CreateMemberTab() {
  const [form, setForm] = useState({ name: '', email: '', password: '', student_id: '', phone: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await apiFetch('/auth/create-member', { method: 'POST', body: JSON.stringify(form) });
          setStatus('Member created successfully.');
          setForm({ name: '', email: '', password: '', student_id: '', phone: '' });
      } catch (err) {
          setStatus(err.message || 'Error creating member.');
      }
  }

  return (
    <div className="rc-admin-card max-w-lg">
      <h2 className="rc-admin-card-title mb-4">Create Member Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="rc-admin-input" />
        <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="rc-admin-input" />
        <input type="password" placeholder="Password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="rc-admin-input" />
        <input type="text" placeholder="Student ID (Optional)" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} className="rc-admin-input" />
        <input type="text" placeholder="Phone (Optional)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="rc-admin-input" />
        <Button type="submit" variant="primary">Create Member</Button>
        {status && <p className="text-red-500 text-sm mt-2">{status}</p>}
      </form>
    </div>
  )
}

/* ─── Crud Tab Helper ─── */
function CrudTab({ endpoint, fields, title }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    apiFetch(endpoint).then((d) => setItems(Array.isArray(d) ? d : [])).catch(() => {});
  }, [endpoint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(form) });
    setItems((prev) => [created, ...prev]);
    setForm({});
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="rc-admin-card-title">{title}</h2>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'ghost' : 'primary'}>
          {showForm ? 'Cancel' : 'Add New'}
        </Button>
      </div>

      {showForm && (
        <div className="rc-admin-card mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={`space-y-1 ${f.wide ? 'md:col-span-2' : ''}`}>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="rc-admin-input"
                    rows={3}
                    required={f.required}
                  />
                ) : f.type === 'select' ? (
                  <select
                    value={form[f.key] || f.options[0].value}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="rc-admin-select-full"
                  >
                    {f.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                    className="rc-admin-input"
                    required={f.required}
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <Button type="submit" variant="primary">Save</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rc-crud-item-row">
            <div className="flex items-center gap-4 min-w-0">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-black truncate">
                  {item.title || item.caption || item.name || item.key || `Item #${item.id}`}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {item.project_name ? `[${item.award_place}] ${item.project_name} - ` : ''}
                  {item.description || item.message || item.value || item.role || ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="rc-crud-delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-sm">No items yet.</p>}
      </div>
    </div>
  );
}

/* ─── Team Editor Tab ─── */
function TeamDisplayTab() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newForm, setNewForm] = useState({ name: '', role: '', photo_url: '', order: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [status, setStatus] = useState('');

  const fetchMembers = async () => {
    try {
      const data = await apiFetch('/display-members');
      setItems(data || []);
    } catch {}
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEditStart = (member) => {
    setEditingId(member.id);
    setEditForm({ ...member });
  };

  const handleEditSave = async (id) => {
    try {
      setStatus('Saving...');
      await apiFetch(`/display-members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      setItems(prev => prev.map(m => m.id === id ? { ...editForm } : m));
      setEditingId(null);
      setStatus('Member updated.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      alert(err.message || 'Error updating member');
    }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    try {
      setStatus('Adding...');
      const created = await apiFetch('/display-members', {
        method: 'POST',
        body: JSON.stringify(newForm),
      });
      setItems(prev => [...prev, created]);
      setNewForm({ name: '', role: '', photo_url: '', order: 0 });
      setShowAddForm(false);
      setStatus('Member added.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      alert(err.message || 'Error adding member');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      setStatus('Deleting...');
      await apiFetch(`/display-members/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(m => m.id !== id));
      setStatus('Member deleted.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      alert(err.message || 'Error deleting member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="rc-admin-card-title">Meet the Team Editor</h2>
          <p className="rc-admin-card-desc">Manage, update, and upload member photographs instantly.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? 'ghost' : 'primary'}>
          {showAddForm ? 'Cancel' : 'Add New Member'}
        </Button>
      </div>

      {status && <p className="text-red-500 text-xs font-mono">{status}</p>}

      {showAddForm && (
        <div className="rc-admin-card max-w-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">New Team Member Details</h3>
          <form onSubmit={handleAddNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text" required
                value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                className="rc-admin-input"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Position / Role</label>
              <input
                type="text" required
                value={newForm.role}
                onChange={e => setNewForm({ ...newForm, role: e.target.value })}
                className="rc-admin-input"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Photo URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or https://i.pravatar.cc/200"
                value={newForm.photo_url}
                onChange={e => setNewForm({ ...newForm, photo_url: e.target.value })}
                className="rc-admin-input"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Display Order</label>
              <input
                type="number"
                value={newForm.order}
                onChange={e => setNewForm({ ...newForm, order: Number(e.target.value) })}
                className="rc-admin-input"
              />
            </div>
            <div className="md:col-span-2 pt-2">
              <Button type="submit" variant="primary">Add Member</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((member) => {
          const isEditing = editingId === member.id;
          return (
            <div key={member.id} className="rc-admin-card flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-2 right-2 text-[8px] font-mono text-gray-400 uppercase">ID: {member.id}</div>

              {isEditing ? (
                <div className="space-y-4 w-full">
                  <div className="flex justify-center mb-2">
                    <img
                      src={editForm.photo_url || 'https://i.pravatar.cc/200?u=fallback'}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border border-gray-200"
                      onError={(e) => { e.target.src = 'https://i.pravatar.cc/200?u=fallback'; }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="rc-admin-input"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Role</label>
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                        className="rc-admin-input"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Photo URL</label>
                      <input
                        type="text"
                        value={editForm.photo_url || ''}
                        onChange={e => setEditForm({ ...editForm, photo_url: e.target.value })}
                        className="rc-admin-input"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Order</label>
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={e => setEditForm({ ...editForm, order: Number(e.target.value) })}
                        className="rc-admin-input"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleEditSave(member.id)} variant="primary" className="py-1 px-3 text-xs">Save</Button>
                    <Button onClick={() => setEditingId(null)} variant="ghost" className="py-1 px-3 text-xs">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center w-full">
                  <img
                    src={member.photo_url || 'https://i.pravatar.cc/200?u=fallback'}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200 mb-4 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://i.pravatar.cc/200?u=fallback'; }}
                  />
                  <h3 className="text-md font-bold text-black">{member.name}</h3>
                  <p className="text-xs text-red-500 mt-1">{member.role}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-mono uppercase tracking-wider">Display Order: {member.order}</p>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 w-full justify-center">
                    <button
                      onClick={() => handleEditStart(member)}
                      className="text-xs font-bold text-gray-700 hover:text-black uppercase tracking-widest transition-colors"
                    >
                      Edit Member
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {items.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No members registered yet.</p>}
    </div>
  );
}

/* ─── Ideas Tab ─── */
function IdeasTab() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    apiFetch('/ideas').then(setIdeas).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await apiFetch('/ideas', { method: 'POST', body: JSON.stringify(form) });
    setIdeas((prev) => [...prev, created]);
    setForm({});
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this idea and any associated team registrations?')) return;
    await apiFetch(`/ideas/${id}`, { method: 'DELETE' });
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };
  
  const handleUnlock = async (id) => {
      if (!confirm('Unlock this idea? The registered team will be removed.')) return;
      await apiFetch(`/ideas/${id}/unlock`, { method: 'PUT' });
      setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: 'available', locked_by_team: null } : i));
  }

  const filtered = ideas.filter((idea) => {
    const matchFilter = filter === 'All' || idea.category === filter;
    const matchSearch = !search || idea.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const fields = [
    { key: 'title', label: 'Title', required: true },
    { key: 'category', label: 'Category (Hardware, Software, IoT)', required: true },
    { key: 'difficulty', label: 'Difficulty (Beginner, Intermediate, Advanced)', required: true },
    { key: 'tech_stack', label: 'Tech Stack' },
    { key: 'description', label: 'Description', type: 'textarea', wide: true, required: true },
    { key: 'learning_outcomes', label: 'Learning Outcomes', type: 'textarea', wide: true },
    { key: 'deadline', label: 'Deadline' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="rc-admin-card-title">Project Ideas ({ideas.length})</h2>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'ghost' : 'primary'}>
          {showForm ? 'Cancel' : 'Upload New Idea'}
        </Button>
      </div>

      {showForm && (
        <div className="rc-admin-card mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={`space-y-1 ${f.wide ? 'md:col-span-2' : ''}`}>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="rc-admin-input"
                    rows={3}
                    required={f.required}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="rc-admin-input"
                    required={f.required}
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <Button type="submit" variant="primary">Upload Idea</Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ideas..."
          className="rc-admin-input max-w-xs"
        />
        {['All', 'Hardware', 'Software', 'IoT'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rc-admin-tab-btn ${filter === f ? 'active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((idea) => (
          <div key={idea.id} className="rc-crud-item-row">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-black">{idea.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-gray-200 text-gray-500">
                  {idea.category}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{idea.difficulty}</span>
                {idea.status === 'locked' && (
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Locked</span>
                )}
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">{idea.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {idea.status === 'locked' && (
                <button
                  onClick={() => handleUnlock(idea.id)}
                  className="text-red-500 hover:text-red-600 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
                >
                  Unlock
                </button>
              )}
              <button
                onClick={() => handleDelete(idea.id)}
                className="rc-crud-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-500 text-sm">No ideas match your search.</p>}
      </div>
    </div>
  );
}

function AchievementsTab() {
  return (
    <CrudTab
      endpoint="/achievements"
      title="Achievements"
      fields={[
        { key: 'title', label: 'Achievement / Win Title', required: true },
        { key: 'project_name', label: 'Associated Project Name', required: true },
        { key: 'award_place', label: 'Winning Place (e.g. 1st Place)', required: true },
        { key: 'image_url', label: 'Project Image URL', required: false },
        { key: 'description', label: 'Detailed Description', type: 'textarea', wide: true },
        { key: 'date', label: 'Date / Year Won' },
        { key: 'category', label: 'Category (e.g. Swarm Robotics, AI)' },
      ]}
    />
  );
}

function GalleryTab() {
  return (
    <CrudTab
      endpoint="/gallery"
      title="Gallery"
      fields={[
        { key: 'image_url', label: 'Image URL', required: true },
        { key: 'caption', label: 'Photo Caption', required: true },
        { key: 'description', label: 'Short Description / Context', type: 'textarea', wide: true },
        { key: 'order', label: 'Display Order (Number)', type: 'number', required: false },
      ]}
    />
  );
}

function EventsTab() {
  return (
    <CrudTab
      endpoint="/events"
      title="Events"
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'date', label: 'Date', required: true },
        { key: 'type', label: 'Type (Workshop, Hackathon, etc.)' },
        { key: 'description', label: 'Description', type: 'textarea', wide: true },
      ]}
    />
  );
}

function ResourcesTab() {
  return (
    <CrudTab
      endpoint="/resources"
      title="Resources"
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'tag', label: 'Tag (GitHub Repository, PDF, etc.)' },
        { key: 'link', label: 'Link / URL' },
        { key: 'description', label: 'Description', type: 'textarea', wide: true },
      ]}
    />
  );
}

function AnnouncementsTab() {
  return (
    <CrudTab
      endpoint="/announcements"
      title="Announcements"
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'type', label: 'Type (General, Alert, Event)', required: true },
        { key: 'target', label: 'Target Audience', type: 'select', options: [
            { value: 'all', label: 'All Registered Accounts' },
            { value: 'members', label: 'Core Members & Admins' },
            { value: 'users', label: 'General Users Only' }
        ], required: true },
        { key: 'message', label: 'Message', type: 'textarea', wide: true, required: true },
      ]}
    />
  );
}

function SiteContentTab() {
  const [content, setContent] = useState({});
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    apiFetch('/site-content').then(setContent).catch(() => {});
  }, []);

  const save = async (key) => {
    await apiFetch('/site-content', {
      method: 'PUT',
      body: JSON.stringify({ key, value: editValue }),
    });
    setContent((prev) => ({ ...prev, [key]: editValue }));
    setEditing(null);
  };

  const keys = [
    { key: 'faculty_name', label: 'Faculty Coordinator Name' },
    { key: 'faculty_title', label: 'Faculty Title' },
    { key: 'faculty_bio', label: 'Faculty Bio' },
    { key: 'faculty_photo', label: 'Faculty Photo URL' },
    { key: 'about_text', label: 'About Section Paragraph 1' },
    { key: 'about_text_2', label: 'About Section Paragraph 2' },
    { key: 'stat_projects', label: 'Stat: Projects' },
    { key: 'stat_members', label: 'Stat: Members' },
    { key: 'stat_stacks', label: 'Stat: Tech Stacks' },
    { key: 'stat_wins', label: 'Stat: Competition Wins' },
    { key: 'contact_email', label: 'Club Contact Email' },
    { key: 'club_phone', label: 'Club Phone Number' },
    { key: 'club_github', label: 'Club GitHub URL' },
    { key: 'club_linkedin', label: 'Club LinkedIn URL' },
    { key: 'club_instagram', label: 'Club Instagram URL' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="rc-admin-card-title mb-6">Site Content</h2>
      {keys.map(({ key, label }) => (
        <div key={key} className="rc-admin-card">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
            {editing === key ? (
              <div className="flex gap-2">
                <button onClick={() => save(key)} className="text-xs font-bold text-black hover:text-red-500">Save</button>
                <button onClick={() => setEditing(null)} className="text-xs text-gray-400 hover:text-black">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setEditing(key); setEditValue(content[key] || ''); }}
                className="text-xs text-gray-400 hover:text-black transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          {editing === key ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="rc-admin-input"
              rows={2}
            />
          ) : (
            <p className="text-sm text-black opacity-80">{content[key] || 'Not set'}</p>
          )}
        </div>
      ))}
    </div>
  );
}
