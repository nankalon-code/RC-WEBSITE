import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [github, setGithub] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = isRegister 
        ? await register(name, email, password, github || null, studentId || null, phone || null) 
        : await login(email, password);
      navigate(`/dashboard/${user.role}`);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border border-var bg-input-bg text-primary-var focus:border-accent";

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 flex items-center justify-center relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-glow blur-[150px] opacity-20" />
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Card className="p-8 glass-card border-var shadow-2xl">
          <h2 className="text-2xl font-display font-bold text-center mb-2 text-primary-var">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-sm text-center mb-8 text-muted-var">
            {isRegister ? 'Register to join the platform' : 'Authenticate to access your workspace'}
          </p>
          {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-var">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="Your full name" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-var">Student ID</label>
                        <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required className={inputCls} placeholder="ID Number" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-var">Phone</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="Phone Number" />
                    </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-var">GitHub Profile (optional)</label>
                  <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} className={inputCls} placeholder="https://github.com/username" />
                </div>
              </>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-var">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-var">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} placeholder="Enter password" />
            </div>
            <div className="pt-2">
                <Button type="submit" className="w-full" variant="primary" disabled={loading}>
                  {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-sm text-muted-var hover:text-primary-var transition-colors">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
