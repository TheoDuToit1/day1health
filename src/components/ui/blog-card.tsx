import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './blog-card.css';

interface BlogCardProps {
  title: string;
  description: string;
  badge?: string;
  imageColor?: string;
  price?: string;
  onClick?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  badge = "NEW",
  imageColor = "#a78bfa",
  price = "Read More",
  onClick
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`card ${isDark ? 'card--dark' : 'card--light'}`} onClick={onClick}>
      <div className="card__shine"></div>
      <div className="card__glow"></div>
      <div className="card__content">
        <div className="card__badge">{badge}</div>
        <div 
          style={{ '--bg-color': imageColor } as React.CSSProperties} 
          className="card__image"
        ></div>
        <div className="card__text">
          <p className="card__title">{title}</p>
          <p className="card__description">{description}</p>
        </div>
        <div className="card__footer">
          <div className="card__price">{price}</div>
          <div className="card__button">
            <svg height="16" width="16" viewBox="0 0 24 24">
              <path
                strokeWidth="2"
                stroke="currentColor"
                d="M4 12H20M12 4V20"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
