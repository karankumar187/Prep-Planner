import React from 'react';
import { format } from 'date-fns';
import { CATEGORY_COLORS } from '../../utils/constants';

const CalendarDayCell = ({ date, isToday, isSelected, isCurrentMonth, tasks, onClick }) => {
  const visibleTasks = tasks.slice(0, 4);
  const extraTasks = Math.max(0, tasks.length - 4);

  return (
    <div 
      onClick={onClick}
      className={`min-h-[100px] bg-slate-800 p-2 cursor-pointer transition-colors relative hover:bg-slate-700/50
        ${!isCurrentMonth ? 'opacity-40' : ''}
        ${isSelected ? 'bg-slate-700/70' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm
          ${isToday ? 'bg-indigo-500 text-white font-bold' : 'text-slate-300'}
        `}>
          {format(date, 'd')}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1">
        {visibleTasks.map((t, i) => (
          <div 
            key={i} 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: CATEGORY_COLORS[t.scheduleTask.category] || '#94a3b8' }}
            title={t.scheduleTask.title}
          />
        ))}
        {extraTasks > 0 && <span className="text-[10px] text-slate-500">+{extraTasks}</span>}
      </div>
    </div>
  );
};

export default CalendarDayCell;
