import React from 'react';

/**
 * StatCard — premium dark stat card
 * Props: label, value, icon, gradient (CSS gradient string), delay
 */
const StatCard = ({ label, value, icon, gradient, delay = 0 }) => {
  return (
    <div
      className="rounded-2xl p-5 animate-slide-up hover:-translate-y-1 transition-all duration-300 cursor-default"
      style={{
        background: '#13131f',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: '#a1a1b5' }}>{label}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: gradient || 'linear-gradient(135deg, #6c5ef7, #4f46e5)' }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

export default StatCard;
