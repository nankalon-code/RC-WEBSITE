import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

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
          <div className="rc-footer-brand">ROBOTICS CLUB / V.04</div>
          <div className="rc-footer-tagline">
            ENGINEERED IN THE WORKSHOP, SINCE 2013.
          </div>
        </div>

        {/* Column 2: Find us */}
        <div className="rc-footer-col">
          <div className="rc-footer-col-title">FIND US</div>
          <div className="rc-footer-col-body">
            A228 Robotics Club<br />
            Electronic Department, A block<br />
            Rajasthan Technical University,<br />
            Rawatbhata Road, Kota 324010<br />
            MON – FRI, 18:00 →
            {content.club_phone && (
              <>
                <br />
                <span style={{ fontSize: '11px', opacity: 0.7, fontFamily: 'monospace' }}>
                  TEL: {content.club_phone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Column 3: Channels */}
        <div className="rc-footer-col">
          <div className="rc-footer-col-title">CHANNELS</div>
          <div className="rc-footer-col-body">
            <a href={content.club_github || '#'} target="_blank" rel="noreferrer" className="rc-footer-link">GITHUB</a><br />
            <a href={content.club_instagram || '#'} target="_blank" rel="noreferrer" className="rc-footer-link">INSTAGRAM</a><br />
            <a href={content.club_linkedin || '#'} target="_blank" rel="noreferrer" className="rc-footer-link">LINKEDIN</a>
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
