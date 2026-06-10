import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', id }) => {
  const hasOverflowClass = className.includes('overflow-');
  
  return (
    <div 
      id={id}
      className={`glass-white tech-border rounded-sm ${!hasOverflowClass ? 'overflow-hidden' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
