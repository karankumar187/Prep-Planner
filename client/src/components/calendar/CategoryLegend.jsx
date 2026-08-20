import React from 'react';
import { CATEGORIES, CATEGORY_COLORS } from '../../utils/constants';

const CategoryLegend = () => {
  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Legend:</span>
      {CATEGORIES.map(cat => (
        <div key={cat} className="flex items-center gap-1 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
          <span>{cat}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryLegend;
