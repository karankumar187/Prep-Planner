import React from 'react';
import { CATEGORY_COLORS } from '../../utils/constants';

const CategoryPill = ({ category }) => {
  const color = CATEGORY_COLORS[category] || '#64748b';
  
  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
      style={{ 
        backgroundColor: `${color}15`, 
        color: color,
        borderColor: `${color}30`
      }}
    >
      {category}
    </span>
  );
};

export default CategoryPill;
