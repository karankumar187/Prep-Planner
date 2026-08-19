import React from 'react';
import { CATEGORIES, CATEGORY_COLORS } from '../../utils/constants';

const CategoryLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <span className="text-sm text-slate-400 mr-2 flex items-center">Legend:</span>
      {CATEGORIES.map(cat => (
        <div key={cat} className="flex items-center gap-1.5 text-xs text-slate-300">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
          {cat}
        </div>
      ))}
    </div>
  );
};

export default CategoryLegend;
