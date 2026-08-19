import React from 'react';

const ProgressBar = ({ value = 0, color = '#3b82f6', height = 8, showLabel = false }) => {
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1 text-slate-400">
          <span>Progress</span>
          <span>{safeValue}%</span>
        </div>
      )}
      <div className="w-full bg-slate-700 rounded-full overflow-hidden" style={{ height: `${height}px` }}>
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safeValue}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
