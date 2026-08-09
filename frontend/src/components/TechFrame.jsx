import React from 'react';

export default function TechFrame({ children, className = '', style = {} }) {
  return (
    <div className={`rc-tech-frame ${className}`} style={style}>
      {/* Precision corner crosshairs */}
      <span className="rc-frame-crosshair rc-frame-ch-tl">+</span>
      <span className="rc-frame-crosshair rc-frame-ch-tr">+</span>
      <span className="rc-frame-crosshair rc-frame-ch-bl">+</span>
      <span className="rc-frame-crosshair rc-frame-ch-br">+</span>
      
      {/* Corner alignment tick marks */}
      <span className="rc-frame-tick rc-frame-tick-tl">—</span>
      <span className="rc-frame-tick rc-frame-tick-tr">—</span>

      {/* Frame content */}
      <div className="rc-tech-frame-content">
        {children}
      </div>
    </div>
  );
}
