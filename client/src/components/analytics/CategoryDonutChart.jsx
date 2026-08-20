import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/constants';

const CategoryDonutChart = ({ data }) => {
  const invalidCategories = new Set(['Reading Material', 'MCQ Assessment']);
  const chartData = data?.filter(d => d.total > 0 && !invalidCategories.has(d.category)) || [];
  
  if (chartData.length === 0) {
    return <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 h-80 flex items-center justify-center text-slate-400">No category data</div>;
  }

  const totalTasks = chartData.reduce((acc, curr) => acc + curr.total, 0);
  const completedTasks = chartData.reduce((acc, curr) => acc + curr.completed, 0);
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 h-80 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-2">Category Breakdown</h3>
      <div className="flex-1 flex items-center">
        <div className="w-1/2 h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="total"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                formatter={(value, name, props) => [`${value} tasks`, props.payload.category]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">{overallPercentage}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Done</span>
          </div>
        </div>
        <div className="w-1/2 pl-4 max-h-[220px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
          {chartData.map((item, i) => (
            <div key={i} className="text-sm">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.category] }} />
                  <span className="text-slate-300 truncate w-16" title={item.category}>{item.category}</span>
                </div>
                <span className="text-slate-400 text-xs">{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: CATEGORY_COLORS[item.category] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDonutChart;
