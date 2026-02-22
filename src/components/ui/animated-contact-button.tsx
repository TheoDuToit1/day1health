import React, { useState } from 'react';
import './animated-contact-button.css';

interface AnimatedContactButtonProps {
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  labelDefault?: string; // e.g., "Continue To Sign Up"
  labelSent?: string;    // e.g., "Sent"
}

export const AnimatedContactButton: React.FC<AnimatedContactButtonProps> = ({ 
  onClick, 
  className = "",
  type = "button",
  labelDefault = 'Send Message',
  labelSent = 'Sent',
}) => {
  const [isSent, setIsSent] = useState(false);

  const handleClick = () => {
    if (isSent) return; // Prevent multiple clicks
    
    // Trigger the animation first
    if (onClick) onClick();
    
    // Wait for the full animation to complete before setting permanent state
    // Cart animation (2s) + text animation (1.2s) + buffer = ~3.5s total
    setTimeout(() => {
      setIsSent(true);
    }, 3500);
  };

  const renderLabel = (label: string) => (
    <p>
      {Array.from(label).map((ch, i) => (
        <span key={`${ch}-${i}`} style={{ '--i': i } as React.CSSProperties}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </p>
  );

  return (
    <button 
      className={`animated-contact-button ${className} ${isSent ? 'sent-state' : ''}`}
      onClick={handleClick}
      type={type}
      disabled={isSent}
    >
      <div className="wrap">
        <div className="state state--default">
          {renderLabel(labelDefault)}
        </div>
        <div className="state state--added">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </div>
          {renderLabel(labelSent)}
        </div>
      </div>
      <div className="bg"></div>
      <div className="bg-spin"></div>
      <div className="bg-gradient"></div>
    </button>
  );
};


