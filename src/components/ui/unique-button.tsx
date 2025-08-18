import React, { useState } from 'react';

interface UniqueButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  height?: string;
}

const UniqueButton: React.FC<UniqueButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  width = '180px',
  height = '60px'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fly-1 {
          from {
            transform: translateY(0.1em);
          }
          to {
            transform: translateY(-0.1em);
          }
        }
      `}</style>
      
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          width,
          height,
          padding: '15px 30px',
          fontSize: '18px',
          textDecoration: 'none',
          color: '#fff',
          backgroundColor: '#16a34a',
          border: 'none',
          borderRadius: '10px',
          overflow: 'hidden',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: '0.3s all ease-in-out',
          opacity: disabled ? 0.6 : 1,
          boxShadow: isHovered && !disabled ? '5px 10px 30px #16a34a' : 'none',
          transform: isHovered ? 'scale(1)' : 'scale(1)',
        }}
      >
        {/* Before pseudo-element */}
        <div
          style={{
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isHovered ? '100%' : '0',
            height: '80%',
            borderBottomLeftRadius: '60px',
            borderTopRightRadius: '60px',
            borderTopLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            backgroundColor: '#2c3e50',
            transition: 'all 0.2s ease-in-out',
            zIndex: 1,
          }}
        />
        
        {/* After pseudo-element */}
        <div
          style={{
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: isHovered ? '100%' : '0',
            borderBottomLeftRadius: '20px',
            borderTopRightRadius: '20px',
            borderTopLeftRadius: '60px',
            borderBottomRightRadius: '60px',
            backgroundColor: '#2c3e50',
            transition: 'all 0.3s ease-in-out',
            zIndex: 1,
          }}
        />

        <div
          style={{
            zIndex: 2,
            position: 'relative',
            animation: isHovered ? 'fly-1 0.6s ease-in-out infinite alternate' : 'none',
            marginLeft: '-1em',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            style={{
              display: 'block',
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease-in-out',
              transform: isHovered ? 'translateX(2.5em) rotate(45deg) scale(1.2)' : 'translateX(0) rotate(0deg) scale(1)',
            }}
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </div>
        
        <span
          style={{
            display: 'block',
            marginLeft: '0.2em',
            transition: 'all 0.3s ease-in-out',
            zIndex: 2,
            position: 'relative',
            transform: isHovered ? 'translateX(12em)' : 'translateX(0)',
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </span>
      </button>
    </>
  );
};

export default UniqueButton;
