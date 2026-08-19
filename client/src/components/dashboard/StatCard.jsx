import React from 'react';

const StatCard = ({ icon: Icon, label, value, sublabel, color = 'indigo' }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
          {Icon && <Icon size={20} />}
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {sublabel && <div className="text-sm text-slate-500">{sublabel}</div>}
      </div>
    </div>
  );
};

export default StatCard;
