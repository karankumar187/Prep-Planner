import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getCategoryAnalytics } from '../utils/api';
import ProgressBar from '../components/shared/ProgressBar';
import { CATEGORY_COLORS } from '../utils/constants';

const Categories = () => {
  const { selectedEnrollment } = useContext(AppContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedEnrollment) {
      getCategoryAnalytics(selectedEnrollment._id).then(res => setData(res.data)).catch(console.error);
    }
  }, [selectedEnrollment]);

  if (!selectedEnrollment) return <div className="text-white">Please select a schedule.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(cat => (
          <div key={cat.category} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.category] }} />
                <h3 className="text-lg font-bold text-white">{cat.category}</h3>
              </div>
              <span className="text-2xl font-bold" style={{ color: CATEGORY_COLORS[cat.category] }}>{cat.percentage}%</span>
            </div>
            
            <p className="text-sm text-slate-400 mb-3">{cat.completed} / {cat.total} tasks completed</p>
            <ProgressBar value={cat.percentage} color={CATEGORY_COLORS[cat.category]} />
          </div>
        ))}
        {data.length === 0 && <div className="text-slate-400">No category data available.</div>}
      </div>
    </div>
  );
};

export default Categories;
