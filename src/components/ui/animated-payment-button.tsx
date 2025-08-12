import React, { useEffect, useRef, useState } from 'react';
import './animated-payment-button.css';

interface AnimatedPaymentButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  hoverMessages?: string[]; // messages to cycle through on hover
  hoverCycleMs?: number; // interval between messages
  showArrow?: boolean; // show expand/collapse arrow
  expanded?: boolean; // current expand state
  onToggleExpand?: () => void; // toggle handler
  hoverIcons?: ("card" | "payment" | "dollar" | "wallet" | "check")[]; // optional icon sequence matching hover messages
}

export const AnimatedPaymentButton: React.FC<AnimatedPaymentButtonProps> = ({
  text = "Choose Plan",
  onClick,
  className = "",
  hoverMessages = [],
  hoverCycleMs = 1200,
  showArrow = false,
  expanded = false,
  onToggleExpand,
  hoverIcons
}) => {
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovering && hoverMessages.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setHoverIndex((i) => (i + 1) % hoverMessages.length);
      }, hoverCycleMs);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovering, hoverMessages, hoverCycleMs]);

  const displayText = isHovering && hoverMessages.length > 0 ? hoverMessages[hoverIndex] : text;

  const activeIndex = isHovering && hoverMessages.length > 0 ? hoverIndex : 0;
  const defaultIcons: ("card" | "payment" | "dollar" | "wallet" | "check")[] = [
    'wallet', 'card', 'payment', 'dollar', 'check'
  ];
  const iconSeq = hoverIcons && hoverIcons.length > 0 ? hoverIcons : defaultIcons;
  const activeIcon = iconSeq[activeIndex % iconSeq.length];

  const renderIcon = (key: "card" | "payment" | "dollar" | "wallet" | "check") => {
    switch (key) {
      case 'card':
        return (
          <svg viewBox="0 0 24 24" className="icon card-icon">
            <path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18C2,19.11 2.89,20 4,20H20C21.11,20 22,19.11 22,18V6C22,4.89 21.11,4 20,4Z" fill="currentColor" />
          </svg>
        );
      case 'payment':
        return (
          <svg viewBox="0 0 24 24" className="icon payment-icon">
            <path d="M2,17H22V21H2V17M6.25,7H9V6H6V3H18V6H15V7H17.75L19,17H5L6.25,7M9,10H15V8H9V10M9,13H15V11H9V13Z" fill="currentColor" />
          </svg>
        );
      case 'dollar':
        return (
          <svg viewBox="0 0 24 24" className="icon dollar-icon">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor" />
          </svg>
        );
      case 'wallet':
        return (
          <svg viewBox="0 0 24 24" className="icon wallet-icon">
            <path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z" fill="currentColor" />
          </svg>
        );
      case 'check':
        return (
          <svg viewBox="0 0 24 24" className="icon check-icon">
            <path d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center gap-2`}>
      <button
        className={`pay-btn ${className}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <span className="btn-text">{displayText}</span>
      <div className="icon-container">{renderIcon(activeIcon)}</div>
      </button>
      {showArrow && (
        <button
          type="button"
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
          className={`ml-1 inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
          onClick={onToggleExpand}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
          </svg>
        </button>
      )}
    </div>
  );
};
