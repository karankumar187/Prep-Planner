import React from 'react';
import { ClipboardList, CheckCircle2, TrendingUp, Clock, Flame } from 'lucide-react';

const OverviewStats = ({ stats }) => {
  const data = [
    { label: 'Total Tasks', value: stats.totalTasks || 0, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: stats.completed || 0, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Completion Rate', value: `${stats.completionRate || 0}%`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Study Hours', value: stats.studyHours?.toFixed(1) || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Current Streak', value: stats.currentStreak || 0, icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {data.map((item, i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
          <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
            <item.icon size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{item.value}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
