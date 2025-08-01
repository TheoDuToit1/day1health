import React from 'react';
import './add-to-cart-button.css';

interface AddToCartButtonProps {
  onClick?: () => void;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <button 
      className={`cart-button ${className}`}
      onClick={onClick}
    >
      <div className="wrap">
        <div className="state state--default">
          <div className="icon-cart">
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
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path
                d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
              ></path>
            </svg>
          </div>
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
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </div>
          <p>
            <span style={{'--i': 0} as React.CSSProperties}>S</span>
            <span style={{'--i': 1} as React.CSSProperties}>e</span>
            <span style={{'--i': 2} as React.CSSProperties}>n</span>
            <span style={{'--i': 3} as React.CSSProperties}>d</span>
            <span style={{'--i': 4} as React.CSSProperties}>&nbsp;</span>
            <span style={{'--i': 5} as React.CSSProperties}>M</span>
            <span style={{'--i': 6} as React.CSSProperties}>e</span>
            <span style={{'--i': 7} as React.CSSProperties}>s</span>
            <span style={{'--i': 8} as React.CSSProperties}>s</span>
            <span style={{'--i': 9} as React.CSSProperties}>a</span>
            <span style={{'--i': 10} as React.CSSProperties}>g</span>
            <span style={{'--i': 11} as React.CSSProperties}>e</span>
          </p>
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
          <p>
            <span style={{'--i': 5} as React.CSSProperties}>S</span>
            <span style={{'--i': 6} as React.CSSProperties}>e</span>
            <span style={{'--i': 7} as React.CSSProperties}>n</span>
            <span style={{'--i': 8} as React.CSSProperties}>t</span>
          </p>
        </div>
      </div>
      <div className="bg"></div>
      <div className="bg-spin"></div>
      <div className="bg-gradient"></div>
    </button>
  );
};
