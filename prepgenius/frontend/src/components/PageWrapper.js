import React from 'react';

/**
 * PageWrapper — consistent dark page shell
 * Props: children, className (extra classes for inner container), fullWidth
 */
const PageWrapper = ({ children, className = '', fullWidth = false }) => {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 py-8 animate-fade-in ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
