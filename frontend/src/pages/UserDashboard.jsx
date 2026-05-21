import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiFetch } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Users, Activity, Bell, FileCode, Lightbulb } from 'lucide-react';

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [teams, setTeams] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myIdea, setMyIdea] = useState(null);
  const [progressForm, setProgressForm] = useState({ progress: 0, progress_description: '', github_repo: '' });
  
  const [proposeForm, setProposeForm] = useState({
    title: '',
    category: 'Software',
    difficulty: 'Intermediate',
    description: '',
    tech_stack: ''
  });
  const [proposeStatus, setProposeStatus] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    apiFetch('/teams').then(setTeams).catch(() => {});
    apiFetch('/ideas').then(setIdeas).catch(() => {});
    apiFetch('/announcements').then((d) => setAnnouncements(d.slice(0, 5))).catch(() => {});
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (teams.length > 0 && ideas.length > 0) {
      // Find team containing the user
      const team = teams.find(t => t.members.some(m => m.member_email === user.email));
      if (team) {
        setMyTeam(team);
        const lockedIdea = ideas.find((i) => i.id === team.idea_id);
        if (lockedIdea) {
          setMyIdea(lockedIdea);
          setProgressForm({
            progress: team.progress || 0,
            progress_description: team.progress_description || '',
            github_repo: team.github_repo || '',
          });
        }
      }
    }
  }, [teams, ideas, user]);

  const updateProgress = async (e) => {
    e.preventDefault();
    if (!myTeam) return;
    await apiFetch(`/teams/${myTeam.id}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressForm),
    });
    alert('Progress updated successfully.');
  };

  const handleProposeIdea = async (e) => {
    e.preventDefault();
    setProposeStatus('Submitting...');
    try {
      const newIdea = await apiFetch('/ideas', {
        method: 'POST',
        body: JSON.stringify(proposeForm)
      });
      setIdeas([...ideas, newIdea]);
      setProposeStatus('Idea submitted successfully! It is now available in the forum.');
      setProposeForm({ title: '', category: 'Software', difficulty: 'Intermediate', description: '', tech_stack: '' });
    } catch (err) {
      setProposeStatus('Failed to submit idea.');
    }
  };

  if (!user) return null;

  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Project', icon: FileCode },
    { name: 'Team', icon: Users },
    { name: 'Progress Log', icon: Activity },
    { name: 'Propose Idea', icon: Lightbulb },
    { name: 'Announcements', icon: Bell },
  ];

  const CountdownTimer = ({ deadlineStr }) => {
      const [timeLeft, setTimeLeft] = useState('');
      useEffect(() => {
          if (!deadlineStr) return;
          const target = new Date(deadlineStr).getTime();
          if (isNaN(target)) return;
          const timer = setInterval(() => {
              const now = new Date().getTime();
              const dist = target - now;
              if (dist < 0) { setTimeLeft('Ended'); clearInterval(timer); return; }
              const d = Math.floor(dist / (1000 * 60 * 60 * 24));
              const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
              setTimeLeft(`${d}d ${h}h ${m}m`);
          }, 1000);
          return () => clearInterval(timer);
      }, [deadlineStr]);
      
      if (!deadlineStr || !timeLeft) return null;
      return (
          <div className="flex items-center text-sm">
            <span className="font-bold mr-2 text-muted-var">Deadline:</span>
            <span className="text-accent font-mono">{timeLeft}</span>
          </div>
      );
  }

  const renderContent = () => {
      switch(activeTab) {
          case 'My Project':
              if (!myIdea || !myTeam) {
                  return (
                      <Card className="glass-card border-var p-12 text-center h-full flex flex-col justify-center items-center">
                          <h2 className="text-2xl font-bold mb-4 text-primary-var">Find a Project</h2>
                          <p className="text-sm text-muted-var mb-6 max-w-md">Browse curated ideas across Hardware, Software, and IoT. Register a team on the forum to lock an idea.</p>
                          <Link to="/forum">
                              <Button variant="primary">Browse Forum</Button>
                          </Link>
                      </Card>
                  );
              }
              return (
                  <div className="space-y-6 h-full">
                      <Card className="glass-card border-var p-6">
                          <div className="flex justify-between items-start mb-4">
                              <h2 className="text-2xl font-display font-bold text-primary-var">{myIdea.title}</h2>
                              <span className="px-3 py-1 bg-input-bg text-muted-var rounded-full text-xs font-bold uppercase tracking-widest border border-var">
                                  {myIdea.category}
                              </span>
                          </div>
                          <p className="text-sm text-muted-var mt-2 mb-6 leading-relaxed">{myIdea.description}</p>
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-var mb-6">
                              <CountdownTimer deadlineStr={myIdea.deadline} />
                              <div className="flex items-center gap-2">
                                  <span className="text-muted-var text-sm font-bold">Team:</span>
                                  <span className="text-primary-var font-mono text-sm">{myTeam.team_name}</span>
                              </div>
                          </div>
                      </Card>
                  </div>
              );
          case 'Team':
              if (!myTeam) return <p className="text-muted-var">No team registered.</p>;
              return (
                  <Card className="glass-card border-var p-6 h-full">
                      <h2 className="text-xl font-display font-bold mb-6 text-primary-var">Team Members</h2>
                      <div className="space-y-4">
                          {myTeam.members?.map(m => (
                              <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border border-var bg-input-bg">
                                  <div className="w-12 h-12 rounded-full border border-accent bg-base-var flex items-center justify-center text-primary-var font-bold">
                                      {m.member_name ? m.member_name.charAt(0).toUpperCase() : '?'}
                                  </div>
                                  <div>
                                      <p className="font-bold text-primary-var">{m.member_name || 'Member'}</p>
                                      <p className="text-xs text-muted-var">{m.member_email}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </Card>
              );
          case 'Progress Log':
              if (!myTeam) return <p className="text-muted-var">No team registered.</p>;
              return (
                  <Card className="glass-card border-var p-6 h-full">
                      <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Update Progress</h2>
                      <form onSubmit={updateProgress} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Progress (%)</label>
                          <input type="range" min="0" max="100" value={progressForm.progress} onChange={(e) => setProgressForm({ ...progressForm, progress: Number(e.target.value) })} className="w-full accent-accent" />
                          <div className="text-right text-primary-var font-bold text-sm">{progressForm.progress}%</div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Progress Description</label>
                          <textarea
                            value={progressForm.progress_description}
                            onChange={(e) => setProgressForm({ ...progressForm, progress_description: e.target.value })}
                            className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                            rows={3}
                            placeholder="What have you accomplished so far?"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-var uppercase tracking-widest">GitHub Repo</label>
                          <input
                            type="url"
                            value={progressForm.github_repo}
                            onChange={(e) => setProgressForm({ ...progressForm, github_repo: e.target.value })}
                            className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent"
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <Button type="submit" variant="primary">Update Progress</Button>
                      </form>
                  </Card>
              );
          case 'Propose Idea':
              return (
                  <Card className="glass-card border-var p-6 h-full">
                      <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Propose a New Project Idea</h2>
                      <p className="text-sm text-muted-var mb-6">Submit your own custom project idea to the forum. Once submitted, you can go to the forum to lock it and register your team.</p>
                      <form onSubmit={handleProposeIdea} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Title</label>
                            <input required type="text" value={proposeForm.title} onChange={e => setProposeForm({...proposeForm, title: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Category</label>
                            <select value={proposeForm.category} onChange={e => setProposeForm({...proposeForm, category: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent">
                              <option value="Software">Software</option>
                              <option value="Hardware">Hardware</option>
                              <option value="IoT">IoT</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Tech Stack</label>
                          <input type="text" value={proposeForm.tech_stack} onChange={e => setProposeForm({...proposeForm, tech_stack: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent" placeholder="e.g. React, Python, Arduino" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-var uppercase tracking-widest">Description</label>
                          <textarea required value={proposeForm.description} onChange={e => setProposeForm({...proposeForm, description: e.target.value})} className="w-full bg-input-bg border border-var rounded-xl px-4 py-3 text-primary-var text-sm outline-none focus:border-accent" rows={4} />
                        </div>
                        <Button type="submit" variant="primary">Submit Idea</Button>
                        {proposeStatus && <p className="text-sm text-accent mt-2">{proposeStatus}</p>}
                      </form>
                  </Card>
              );
          case 'Announcements':
              return (
                <Card className="glass-card border-var p-6 h-full">
                  <h2 className="text-xl font-display font-bold mb-4 text-primary-var">Announcements</h2>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="glass-card border-var p-6">
                          <h3 className="text-muted-var text-sm uppercase tracking-widest mb-2 font-bold">Team</h3>
                          <p className="text-3xl font-display font-bold text-primary-var mb-2">{myTeam ? myTeam.team_name : 'No Team'}</p>
                          <p className="text-xs text-muted-var">Registered Team Name</p>
                      </Card>
                      <Card className="glass-card border-var p-6">
                          <h3 className="text-muted-var text-sm uppercase tracking-widest mb-2 font-bold">Progress</h3>
                          <p className="text-3xl font-display font-bold text-accent mb-2">{myTeam ? `${myTeam.progress}%` : '0%'}</p>
                          <p className="text-xs text-muted-var">Project Completion</p>
                      </Card>
                      <Card className="glass-card border-var p-6 md:col-span-2 flex flex-col justify-center items-center text-center py-12">
                          <h2 className="text-2xl font-display font-bold text-primary-var mb-4">Welcome to your dashboard</h2>
                          <p className="text-muted-var max-w-md">Use the sidebar to view your project details, manage your team, and track your progress.</p>
                      </Card>
                  </div>
              );
      }
  }

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
