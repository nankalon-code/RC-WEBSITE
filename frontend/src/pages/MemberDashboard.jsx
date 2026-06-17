import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiFetch } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Lightbulb, Activity, Bell, User as UserIcon } from 'lucide-react';

export default function MemberDashboard() {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ideaForm, setIdeaForm] = useState({ title: '', category: 'Hardware', difficulty: 'Beginner', description: '', tech_stack: '' });
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [checkInStatus, setCheckInStatus] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: '',
    student_id: '',
    github_url: '',
    linkedin_url: '',
    phone: '',
  });
  const [profileStatus, setProfileStatus] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user || !['admin', 'member'].includes(user.role)) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = () => {
      apiFetch(`/attendance/${user.id}`).then(setAttendance).catch(() => {});
      apiFetch('/announcements').then((d) => setAnnouncements(d.slice(0, 5))).catch(() => {});
      // Fetch ideas (simulating user's ideas by just taking the list, since backend doesn't filter by user yet)
      apiFetch('/ideas').then(setSavedIdeas).catch(() => {});
  }

  const handleCheckIn = async () => {
      setCheckInStatus('Checking in...');
      try {
          await apiFetch('/attendance/checkin', { method: 'POST' });
          setCheckInStatus('Checked in successfully!');
          fetchData();
          setTimeout(() => setCheckInStatus(''), 3000);
      } catch (err) {
          setCheckInStatus(err.message || 'Check-in failed');
          setTimeout(() => setCheckInStatus(''), 3000);
      }
  }

  const saveIdea = async (e) => {
    e.preventDefault();
    try {
        await apiFetch('/ideas', { method: 'POST', body: JSON.stringify(ideaForm) });
        setIdeaForm({ title: '', category: 'Hardware', difficulty: 'Beginner', description: '', tech_stack: '' });
        fetchData();
    } catch (err) {
        alert(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        student_id: user.student_id || '',
        github_url: user.github_url || '',
        linkedin_url: user.linkedin_url || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileStatus('Updating...');
    try {
      await updateProfile(profileForm);
      setProfileStatus('Profile updated successfully!');
      setTimeout(() => setProfileStatus(''), 4000);
    } catch (err) {
      setProfileStatus(err.message || 'Failed to update profile.');
    }
  };

  if (!user) return null;

  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Profile', icon: UserIcon },
    { name: 'Attendance', icon: Calendar },
    { name: 'My Idea', icon: Lightbulb },
    { name: 'Progress Log', icon: Activity },
    { name: 'Announcements', icon: Bell },
  ];

  // Simple Heatmap component
  const AttendanceHeatmap = () => {
      const today = new Date();
      const records = new Set(attendance.map(a => a.date));
      const cells = [];
      for (let i = 0; i < 30; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - (29 - i));
          const dateStr = d.toISOString().split('T')[0];
          cells.push(
              <div 
                  key={i} 
                  title={dateStr}
                  className={`w-4 h-4 rounded-sm ${records.has(dateStr) ? 'bg-accent' : 'bg-surface-var border border-var'}`} 
              />
          );
      }
      return (
          <div className="flex flex-wrap gap-1 mt-4">
              {cells}
          </div>
      );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'My Profile':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-fadeIn">
            {/* Edit Profile Form */}
            <Card className="glass-card border-var p-6 lg:col-span-2">
              <h2 className="text-xl font-display font-bold mb-2 text-primary-var">Profile Details</h2>
              <p className="text-xs text-muted-var mb-6">Keep your contact and workspace details up to date.</p>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Roll Number / Student ID</label>
                    <input
                      type="text"
                      value={profileForm.student_id}
                      onChange={(e) => setProfileForm({ ...profileForm, student_id: e.target.value })}
                      className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                      placeholder="e.g. 2026CS101"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-var uppercase tracking-widest">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={profileForm.github_url}
                      onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                      className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-var uppercase tracking-widest">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={profileForm.linkedin_url}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                      className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Button type="submit" variant="primary">Save Changes</Button>
                  {profileStatus && (
                    <span className={`text-sm font-bold ${profileStatus.includes('success') ? 'text-accent' : 'text-primary-var/60 animate-pulse'}`}>
                      {profileStatus}
                    </span>
                  )}
                </div>
              </form>
            </Card>

            {/* Club Position & Info */}
            <div className="space-y-6">
              <Card className="glass-card border-var p-6">
                <h3 className="text-muted-var text-xs uppercase tracking-widest mb-4 font-bold">Club Status</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">Assigned Position</p>
                    <p className="text-lg font-bold text-accent font-display">{user.position || 'Club Member'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">Membership Role</p>
                    <p className="text-sm font-bold text-primary-var uppercase">{user.role}</p>
                  </div>
                  <div className="pt-2 border-t border-var">
                    <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold mb-2">Platform Access</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                      Active Member
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'Attendance':
        return (
          <Card className="glass-card border-var p-6 h-full">
            <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Attendance Tracker</h2>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-muted-var text-sm">Last 30 days activity</p>
                    <AttendanceHeatmap />
                </div>
                <div className="text-right">
                    <Button onClick={handleCheckIn} variant="primary">Self Check-In</Button>
                    {checkInStatus && <p className="text-xs text-accent mt-2">{checkInStatus}</p>}
                </div>
            </div>
            
            <div className="border-t border-var pt-4 mt-8">
              <h3 className="text-sm font-bold text-primary-var mb-3">Check-in History</h3>
              {attendance.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {attendance.slice().reverse().map((a) => (
                    <div key={a.id} className="flex justify-between text-sm text-muted-var py-2 border-b border-var">
                      <span>{a.date}</span>
                      <span className="text-accent">{a.event_name || 'General'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-var">No attendance records yet.</p>
              )}
            </div>
          </Card>
        );
      case 'My Idea':
        return (
          <div className="space-y-6 h-full">
            <Card className="glass-card border-var p-6">
              <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Propose Idea</h2>
              <p className="text-muted-var text-sm mb-6">Submit an idea to the public forum for team registration.</p>
              <form onSubmit={saveIdea} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Idea Title</label>
                  <input
                    type="text"
                    value={ideaForm.title}
                    onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Category</label>
                        <select value={ideaForm.category} onChange={e => setIdeaForm({...ideaForm, category: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent">
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="IoT">IoT</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Difficulty</label>
                        <select value={ideaForm.difficulty} onChange={e => setIdeaForm({...ideaForm, difficulty: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Description</label>
                  <textarea
                    value={ideaForm.description}
                    onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Tech Stack</label>
                  <input
                    type="text"
                    value={ideaForm.tech_stack}
                    onChange={(e) => setIdeaForm({ ...ideaForm, tech_stack: e.target.value })}
                    className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                  />
                </div>
                <Button type="submit" variant="primary">Submit Idea to Forum</Button>
              </form>
            </Card>
          </div>
        );
      case 'Progress Log':
        return (
          <Card className="glass-card border-var p-6 h-full">
            <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Progress Stepper</h2>
            <div className="flex flex-col space-y-6 relative ml-4 mt-8">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-var" />
                
                {['Ideation', 'Prototyping', 'Development', 'Testing', 'Complete'].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${idx <= 1 ? 'bg-accent border-accent text-base-var' : 'bg-base-var border-var text-muted-var'}`}>
                            {idx + 1}
                        </div>
                        <div className="flex-1 glass-card p-4 rounded-xl border-var">
                            <h4 className="font-bold text-primary-var">{step}</h4>
                            <p className="text-xs text-muted-var mt-1">Status: {idx <= 1 ? 'In Progress' : 'Pending'}</p>
                        </div>
                    </div>
                ))}
            </div>
          </Card>
        );
      case 'Announcements':
        return (
          <Card className="glass-card border-var p-6 h-full">
            <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Club Announcements</h2>
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-input-bg rounded-xl border border-var">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-accent uppercase tracking-widest">{ann.type}</span>
                      <span className="text-xs text-muted-var">{new Date(ann.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-primary-var text-sm mb-1">{ann.title}</h3>
                    <p className="text-sm text-muted-var">{ann.message}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-var">No announcements.</p>}
          </Card>
        );
      case 'Overview':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <Card className="glass-card border-var p-6">
                  <h3 className="text-muted-var text-xs uppercase tracking-widest mb-2 font-bold">Attendance</h3>
                  <p className="text-4xl font-display font-bold text-primary-var mb-2">{attendance.length}</p>
                  <p className="text-xs text-muted-var">Events Attended</p>
              </Card>
              <Card className="glass-card border-var p-6">
                  <h3 className="text-muted-var text-xs uppercase tracking-widest mb-2 font-bold">Role</h3>
                  <p className="text-2xl font-display font-bold text-accent mb-2 uppercase">{user.role}</p>
                  <p className="text-xs text-muted-var">Permissions granted</p>
              </Card>
              
              {/* Profile Details Card */}
              <Card className="glass-card border-var p-6 md:col-span-2">
                  <h3 className="text-muted-var text-xs uppercase tracking-widest mb-4 font-bold">Your Club Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                          <div>
                              <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">Name</p>
                              <p className="text-base font-bold text-primary-var">{user.name}</p>
                          </div>
                          <div>
                              <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">Assigned Position</p>
                              <p className="text-sm text-accent font-bold font-display">{user.position || 'Club Member'}</p>
                          </div>
                          <div>
                              <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">Roll Number / Student ID</p>
                              <p className="text-sm text-primary-var font-mono">{user.student_id || 'Not set'}</p>
                          </div>
                      </div>
                      <div className="space-y-3">
                          {user.github_url && (
                              <div>
                                  <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">GitHub Profile</p>
                                  <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline truncate block">
                                      {user.github_url}
                                  </a>
                              </div>
                          )}
                          {user.linkedin_url && (
                              <div>
                                  <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">LinkedIn Profile</p>
                                  <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline truncate block">
                                      {user.linkedin_url}
                                  </a>
                              </div>
                          )}
                          {user.phone && (
                              <div>
                                  <p className="text-[10px] text-muted-var uppercase tracking-wider font-bold">Phone Contact</p>
                                  <p className="text-xs text-primary-var font-mono">{user.phone}</p>
                              </div>
                          )}
                      </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-var flex justify-end">
                      <button onClick={() => setActiveTab('My Profile')} className="text-xs font-bold text-accent hover:underline">
                          Edit Profile Details →
                      </button>
                  </div>
              </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-24 flex flex-col md:flex-row gap-8 relative z-10">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-0 w-[40rem] h-[40rem] bg-accent/5 blur-[150px] rounded-full pointer-events-none animate-float-slow -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-float-reverse -z-10" />

      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
          <Card className="glass-card border-var p-6 mb-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center text-2xl font-display font-bold text-primary-var mb-3">
                  {user.name.charAt(0)}
              </div>
              <h3 className="font-bold text-primary-var">{user.name}</h3>
              <p className="text-xs text-accent uppercase tracking-widest mt-1">{user.role}</p>
          </Card>
          
          <nav className="flex flex-col space-y-1">
              {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                      <button 
                          key={tab.name}
                          onClick={() => setActiveTab(tab.name)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                              activeTab === tab.name 
                                  ? 'bg-accent/10 text-accent border border-accent/20' 
                                  : 'text-muted-var hover:bg-surface-var hover:text-primary-var border border-transparent'
                          }`}
                      >
                          <Icon size={18} />
                          {tab.name}
                      </button>
                  );
              })}
          </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
              <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
              >
                  {renderContent()}
              </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
}
