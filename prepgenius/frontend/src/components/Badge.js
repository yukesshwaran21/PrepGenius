import React from 'react';

/**
 * Badge — pill badge component
 * variants: 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'brand'
 */
const variantStyles = {
  success: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' },
  warning: { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' },
  info:    { background: 'rgba(59,130,246,0.15)',  color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' },
  danger:  { background: 'rgba(239,68,68,0.15)',   color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  neutral: { background: 'rgba(255,255,255,0.06)', color: '#a1a1b5', border: '1px solid rgba(255,255,255,0.08)' },
  brand:   { background: 'rgba(108,94,247,0.15)',  color: '#8179fa', border: '1px solid rgba(108,94,247,0.25)' },
};

const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const styles = variantStyles[variant] || variantStyles.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${className}`}
      style={styles}
    >
      {children}
    </span>
  );
};

export default Badge;
