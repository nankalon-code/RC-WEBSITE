import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiFetch } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const TABS = ['Overview', 'Users', 'Create Member', 'Ideas', 'Team Display', 'Achievements', 'Events', 'Resources', 'Announcements', 'Site Content'];

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
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-24 relative z-10">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-0 w-[40rem] h-[40rem] bg-accent/5 blur-[150px] rounded-full pointer-events-none animate-float-slow -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-float-reverse -z-10" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-var">Admin Panel</h1>
          <p className="text-muted-var text-sm mt-1">Manage the entire platform without touching code.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-var pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? 'bg-primary-var text-base-var shadow-[0_0_15px_var(--color-accent)]'
                : 'text-muted-var hover:text-primary-var hover:bg-glass-bg'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'Overview' && <OverviewTab />}
          {tab === 'Users' && <UsersTab currentUser={user} />}
          {tab === 'Create Member' && <CreateMemberTab />}
          {tab === 'Ideas' && <IdeasTab />}
          {tab === 'Team Display' && <TeamDisplayTab />}
          {tab === 'Achievements' && <AchievementsTab />}
          {tab === 'Events' && <EventsTab />}
          {tab === 'Resources' && <ResourcesTab />}
          {tab === 'Announcements' && <AnnouncementsTab />}
          {tab === 'Site Content' && <SiteContentTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


function OverviewTab() {
  const [stats, setStats] = useState({ users: 0, ideas: 0, locked: 0, teams: 0, events: 0 });

  useEffect(() => {
    Promise.all([
      apiFetch('/admin/users'),
      apiFetch('/ideas'),
      apiFetch('/teams'),
      apiFetch('/events')
    ]).then(([users, ideas, teams, events]) => {
      setStats({
        users: users.length,
        ideas: ideas.length,
        locked: ideas.filter((i) => i.status === 'locked').length,
        teams: teams.length,
        events: events.length
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users },
    { label: 'Total Ideas', value: stats.ideas },
    { label: 'Locked Ideas', value: stats.locked },
    { label: 'Registered Teams', value: stats.teams },
    { label: 'Events', value: stats.events },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((c) => (
        <Card key={c.label} className="glass-card border-var p-6">
          <h3 className="text-xs font-bold text-muted-var uppercase tracking-widest">{c.label}</h3>
          <p className="text-3xl font-display font-bold mt-3 text-primary-var">{c.value}</p>
        </Card>
      ))}
    </div>
  );
}


function UsersTab({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    apiFetch('/admin/users').then(setUsers).catch(() => {});
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      await apiFetch(`/admin/users/${userId}/role?role=${newRole}`, { method: 'PUT' });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert(err.message);
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
    <Card className="glass-card border-var p-6">
      <h2 className="text-xl font-display font-bold mb-2 text-primary-var">All Users</h2>
      {!isSuperAdmin && (
        <p className="text-xs text-muted-var mb-4">Only the primary admin can grant admin access to others.</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-var text-muted-var">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var">
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="group hover:bg-glass-bg transition-colors">
                <td className="py-4 text-primary-var">{u.name}</td>
                <td className="py-4 text-muted-var">{u.email}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    u.role === 'admin' ? 'bg-primary-var/20 text-primary-var border border-primary-var/30' :
                    u.role === 'member' ? 'bg-accent/20 text-accent border border-accent/30' :
                    'bg-input-bg text-muted-var border border-var'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-4">
                  <button onClick={() => toggleActive(u.id)} className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                      u.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-green-500/10 hover:text-green-400'
                  }`}>
                      {u.is_active ? 'Active' : 'Deactivated'}
                  </button>
                </td>
                <td className="py-4">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="bg-input-bg border border-var rounded px-2 py-1 text-xs text-primary-var outline-none"
                  >
                    <option value="user">User</option>
                    <option value="member">Member</option>
                    {isSuperAdmin && <option value="admin">Admin</option>}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-var">
              <Button variant="ghost" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</Button>
              <span className="text-sm text-muted-var">Page {page} of {totalPages}</span>
              <Button variant="ghost" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
          </div>
      )}
    </Card>
  );
}


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
      <Card className="glass-card border-var p-6 max-w-lg">
          <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Create Member Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-sm outline-none text-primary-var" />
              <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-sm outline-none text-primary-var" />
              <input type="password" placeholder="Password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-sm outline-none text-primary-var" />
              <input type="text" placeholder="Student ID (Optional)" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-sm outline-none text-primary-var" />
              <input type="text" placeholder="Phone (Optional)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-sm outline-none text-primary-var" />
              <Button type="submit" variant="primary">Create Member</Button>
              {status && <p className="text-accent text-sm mt-2">{status}</p>}
          </form>
      </Card>
  )
}


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
        <h2 className="text-xl font-display font-bold text-primary-var">{title}</h2>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'ghost' : 'primary'}>
          {showForm ? 'Cancel' : 'Add New'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 glass-card border-var p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={`space-y-1 ${f.wide ? 'md:col-span-2' : ''}`}>
                <label className="text-xs font-bold text-muted-var uppercase tracking-widest">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    rows={3}
                    required={f.required}
                  />
                ) : f.type === 'select' ? (
                  <select
                    value={form[f.key] || f.options[0].value}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                  >
                    {f.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    required={f.required}
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <Button type="submit" variant="primary">Save</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="p-4 flex items-center justify-between glass-card border-var">
            <div>
              <h3 className="font-bold text-primary-var">{item.title || item.name || item.key}</h3>
              <p className="text-sm text-muted-var mt-1 line-clamp-1">
                {item.description || item.message || item.value || item.role || ''}
              </p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-400/60 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors ml-4"
            >
              Delete
            </button>
          </Card>
        ))}
        {items.length === 0 && <p className="text-muted-var text-sm">No items yet.</p>}
      </div>
    </div>
  );
}


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
          <h2 className="text-xl font-display font-bold text-primary-var">Meet the Team Editor</h2>
          <p className="text-xs text-muted-var mt-1">Manage, update, and upload member photographs instantly.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? 'ghost' : 'primary'}>
          {showAddForm ? 'Cancel' : 'Add New Member'}
        </Button>
      </div>

      {status && <p className="text-accent text-xs font-mono">{status}</p>}

      {showAddForm && (
        <Card className="glass-card border-var p-6 max-w-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-var mb-4">New Team Member Details</h3>
          <form onSubmit={handleAddNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Full Name</label>
              <input
                type="text" required
                value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                className="w-full bg-input-bg border border-var rounded-xl px-4 py-2 text-primary-var text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Position / Role</label>
              <input
                type="text" required
                value={newForm.role}
                onChange={e => setNewForm({ ...newForm, role: e.target.value })}
                className="w-full bg-input-bg border border-var rounded-xl px-4 py-2 text-primary-var text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Photo URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or https://i.pravatar.cc/200"
                value={newForm.photo_url}
                onChange={e => setNewForm({ ...newForm, photo_url: e.target.value })}
                className="w-full bg-input-bg border border-var rounded-xl px-4 py-2 text-primary-var text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-var uppercase tracking-wider">Display Order</label>
              <input
                type="number"
                value={newForm.order}
                onChange={e => setNewForm({ ...newForm, order: Number(e.target.value) })}
                className="w-full bg-input-bg border border-var rounded-xl px-4 py-2 text-primary-var text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="md:col-span-2 pt-2">
              <Button type="submit" variant="primary">Add Member</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((member) => {
          const isEditing = editingId === member.id;
          return (
            <Card key={member.id} className="glass-card border-var p-6 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-2 right-2 text-[8px] font-mono text-muted-var uppercase">ID: {member.id}</div>

              {isEditing ? (
                <div className="space-y-4 w-full">
                  <div className="flex justify-center mb-2">
                    <img
                      src={editForm.photo_url || 'https://i.pravatar.cc/200?u=fallback'}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border border-var"
                      onError={(e) => { e.target.src = 'https://i.pravatar.cc/200?u=fallback'; }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-muted-var uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-input-bg border border-var rounded-xl px-3 py-1.5 text-primary-var text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-muted-var uppercase tracking-wider">Role</label>
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                        className="w-full bg-input-bg border border-var rounded-xl px-3 py-1.5 text-primary-var text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-muted-var uppercase tracking-wider">Photo URL</label>
                      <input
                        type="text"
                        value={editForm.photo_url || ''}
                        onChange={e => setEditForm({ ...editForm, photo_url: e.target.value })}
                        className="w-full bg-input-bg border border-var rounded-xl px-3 py-1.5 text-primary-var text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-muted-var uppercase tracking-wider">Order</label>
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={e => setEditForm({ ...editForm, order: Number(e.target.value) })}
                        className="w-full bg-input-bg border border-var rounded-xl px-3 py-1.5 text-primary-var text-xs outline-none"
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
                    className="w-24 h-24 rounded-full object-cover border-2 border-var mb-4 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://i.pravatar.cc/200?u=fallback'; }}
                  />
                  <h3 className="text-md font-display font-bold text-primary-var">{member.name}</h3>
                  <p className="text-xs text-accent mt-1">{member.role}</p>
                  <p className="text-[10px] text-muted-var mt-2 font-mono uppercase tracking-wider">Display Order: {member.order}</p>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-var w-full justify-center">
                    <button
                      onClick={() => handleEditStart(member)}
                      className="text-xs font-bold text-primary-var hover:text-accent uppercase tracking-widest transition-colors"
                    >
                      Edit Member
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-xs font-bold text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {items.length === 0 && <p className="text-muted-var text-sm text-center py-6">No members registered yet.</p>}
    </div>
  );
}

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
        <h2 className="text-xl font-display font-bold text-primary-var">Project Ideas ({ideas.length})</h2>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'ghost' : 'primary'}>
          {showForm ? 'Cancel' : 'Upload New Idea'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 glass-card border-var p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={`space-y-1 ${f.wide ? 'md:col-span-2' : ''}`}>
                <label className="text-xs font-bold text-muted-var uppercase tracking-widest">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    rows={3}
                    required={f.required}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    required={f.required}
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <Button type="submit" variant="primary">Upload Idea</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ideas..."
          className="bg-input-bg border border-var rounded-xl px-4 py-2 text-primary-var text-sm outline-none focus:border-accent w-64"
        />
        {['All', 'Hardware', 'Software', 'IoT'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f ? 'bg-primary-var text-base-var' : 'bg-glass-bg text-muted-var hover:text-primary-var'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((idea) => (
          <Card key={idea.id} className="p-4 flex items-start justify-between gap-4 glass-card border-var">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-primary-var">{idea.title}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                  idea.category === 'Hardware' ? 'bg-[var(--glass-bg-hover)] text-[var(--color-text-main)] border-[var(--color-border-hover)]' :
                  idea.category === 'Software' ? 'bg-[var(--glass-bg-hover)] text-[var(--color-text-main)] border-[var(--color-border-hover)]' :
                  'bg-[var(--glass-bg)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                }`}>
                  {idea.category}
                </span>
                <span className="text-[10px] text-muted-var uppercase tracking-widest">{idea.difficulty}</span>
                {idea.status === 'locked' && (
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Locked</span>
                )}
              </div>
              <p className="text-sm text-muted-var line-clamp-1">{idea.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
                {idea.status === 'locked' && (
                    <button
                      onClick={() => handleUnlock(idea.id)}
                      className="text-accent hover:text-accent text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
                    >
                      Unlock
                    </button>
                )}
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="text-red-400/50 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
                >
                  Delete
                </button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-var text-sm">No ideas match your search.</p>}
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
        { key: 'title', label: 'Title', required: true },
        { key: 'description', label: 'Description', type: 'textarea', wide: true },
        { key: 'date', label: 'Date' },
        { key: 'category', label: 'Category' },
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
    { key: 'club_github', label: 'Club GitHub URL' },
    { key: 'club_linkedin', label: 'Club LinkedIn URL' },
    { key: 'club_instagram', label: 'Club Instagram URL' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display font-bold text-primary-var mb-6">Site Content</h2>
      {keys.map(({ key, label }) => (
        <Card key={key} className="p-4 glass-card border-var">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-muted-var uppercase tracking-widest">{label}</label>
            {editing === key ? (
              <div className="flex gap-2">
                <button onClick={() => save(key)} className="text-xs font-bold text-primary-var hover:text-accent">Save</button>
                <button onClick={() => setEditing(null)} className="text-xs text-muted-var hover:text-primary-var">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setEditing(key); setEditValue(content[key] || ''); }}
                className="text-xs text-muted-var hover:text-primary-var transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          {editing === key ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
              rows={2}
            />
          ) : (
            <p className="text-sm text-primary-var opacity-80">{content[key] || 'Not set'}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
