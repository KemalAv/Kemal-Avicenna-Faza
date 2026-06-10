import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-black transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-tech active:scale-95';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-glow-blue border border-blue-500',
    secondary: 'glass-blue text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white',
    outline: 'border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-500 bg-white/50',
    ghost: 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-10 py-5 text-sm'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
