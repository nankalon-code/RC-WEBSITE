import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export default function Footer() {
  const [content, setContent] = useState({});

  useEffect(() => {
    apiFetch('/site-content').then(setContent).catch(() => {});
  }, []);

  return (
    <footer className="w-full border-t border-var bg-base-var pt-16 pb-8 px-6 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex-1">
          <Link to="/" className="text-2xl font-display font-medium tracking-tight text-primary-var mb-4 block">
            Robotics<span className="text-muted-var font-light">Club</span>
          </Link>
          <p className="text-muted-var text-sm max-w-sm leading-relaxed">
            {content.about_text || 'Engineering hardware, synthesizing software, and pushing the boundaries of autonomous systems.'}
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-primary-var font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/forum" className="text-muted-var hover:text-accent transition-colors">Forum</Link></li>
              <li><Link to="/login" className="text-muted-var hover:text-accent transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-primary-var font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              {content.club_github && (
                <a href={content.club_github} target="_blank" rel="noreferrer" className="text-muted-var hover:text-accent transition-colors">
                  <Github size={20} />
                </a>
              )}
              {content.club_linkedin && (
                <a href={content.club_linkedin} target="_blank" rel="noreferrer" className="text-muted-var hover:text-accent transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
              {content.club_instagram && (
                <a href={content.club_instagram} target="_blank" rel="noreferrer" className="text-muted-var hover:text-accent transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              <a href={`mailto:${content.contact_email || 'contact@robotics.club'}`} className="text-muted-var hover:text-accent transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-var flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-var">
        <p>&copy; {new Date().getFullYear()} Robotics Club. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary-var transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-var transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
