import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { Github, Instagram, Linkedin, Phone, MapPin, Clock, Shield } from 'lucide-react';

const ensureAbsoluteUrl = (url) => {
  if (!url || url === '#') return '#';
  const clean = url.trim();
  if (/^(https?:)?\/\//i.test(clean)) return clean;
  return `https://${clean}`;
};

export default function Footer() {
  const [content, setContent] = useState({});
  useEffect(() => {
    apiFetch('/site-content').then(setContent).catch(() => {});
  }, []);

  return (
    <footer className="rc-footer">
      <div className="rc-footer-inner">
        {/* Column 1: Brand */}
        <div className="rc-footer-col">
          <div className="rc-footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} className="rc-brand-accent" />
            ROBOTICS CLUB / V.04
          </div>
          <div className="rc-footer-tagline">
            ENGINEERED IN THE WORKSHOP, SINCE 2013.
          </div>
        </div>

        {/* Column 2: Find us */}
        <div className="rc-footer-col">
          <div className="rc-footer-col-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} style={{ color: '#ff3b30' }} />
            FIND US
          </div>
          <div className="rc-footer-col-body">
            Rajasthan Technical University,<br />
            Rawatbhata Road, Kota 324010<br />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <Clock size={12} style={{ opacity: 0.6 }} />
              MON – FRI, 18:00 →
            </span>
            {content.club_phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '11px', opacity: 0.7, fontFamily: 'monospace' }}>
                <Phone size={12} style={{ color: '#ff3b30' }} />
                TEL: {content.club_phone}
              </span>
            )}
          </div>
        </div>

        {/* Column 3: Channels */}
        <div className="rc-footer-col">
          <div className="rc-footer-col-title">CHANNELS</div>
          <div className="rc-footer-col-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href={ensureAbsoluteUrl(content.club_github)} target="_blank" rel="noreferrer" className="rc-footer-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Github size={14} /> GITHUB
            </a>
            <a href={ensureAbsoluteUrl(content.club_instagram)} target="_blank" rel="noreferrer" className="rc-footer-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Instagram size={14} /> INSTAGRAM
            </a>
            <a href={ensureAbsoluteUrl(content.club_linkedin)} target="_blank" rel="noreferrer" className="rc-footer-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Linkedin size={14} /> LINKEDIN
            </a>
          </div>
        </div>

        {/* Column 4: Copyright */}
        <div className="rc-footer-col rc-footer-col-right">
          <div className="rc-footer-pages">005 / 005</div>
          <div className="rc-footer-copy">© {new Date().getFullYear()}</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="rc-footer-bottom">
        <div className="rc-footer-bottom-left">
          <span className="rc-footer-dot" />
          <Link to="/" className="rc-footer-bottom-link">Share</Link>
        </div>
        <div className="rc-footer-bottom-right">
          <Link to="/forum" className="rc-footer-bottom-link">BUILD ↗</Link>
        </div>
      </div>
    </footer>
  );
}
