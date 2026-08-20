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

  const halfIndex = Math.ceil(chartData.length / 2);
  const leftColumn = chartData.slice(0, halfIndex);
  const rightColumn = chartData.slice(halfIndex);

  const CategoryItem = ({ item }) => (
    <div className="text-sm">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#64748b' }} />
          <span className="text-slate-300 truncate" title={item.category}>{item.category}</span>
        </div>
        <span className="text-slate-400 text-xs ml-2 flex-shrink-0">{item.percentage}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1.5">
        <div className="h-1.5 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: CATEGORY_COLORS[item.category] || '#64748b' }} />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col h-full min-h-[320px]">
      <h3 className="text-lg font-bold text-white mb-6">Category Breakdown</h3>
      <div className="flex-1 flex flex-row items-center justify-between gap-4 md:gap-6">
        
        {/* Left Column */}
        <div className="flex-1 space-y-4 min-w-0">
          {leftColumn.map((item, i) => (
            <CategoryItem key={`left-${i}`} item={item} />
          ))}
        </div>

        {/* Center Donut */}
        <div className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] relative flex-shrink-0">
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
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(value, name, props) => [`${value} tasks`, props.payload.category]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">{overallPercentage}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Done</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-4 min-w-0">
          {rightColumn.map((item, i) => (
            <CategoryItem key={`right-${i}`} item={item} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default CategoryDonutChart;
