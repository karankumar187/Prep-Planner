import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock } from 'lucide-react';
import { CATEGORY_COLORS } from '../../utils/constants';

const CalendarDayCell = ({ date, isToday, isSelected, isCurrentMonth, tasks, onClick }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const isAllCompleted = totalTasks > 0 && completedTasks === totalTasks;
  const hasTasks = totalTasks > 0;
  const completionPercentage = hasTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Unique categories for this day
  const uniqueCategories = Array.from(
    new Set(tasks.map(t => t.scheduleTask?.category).filter(Boolean))
  );

  const visibleCategories = uniqueCategories.slice(0, 3);
  const extraCategoriesCount = uniqueCategories.length - visibleCategories.length;

  return (
    <div 
      onClick={onClick}
      className={`min-h-[85px] md:min-h-[105px] p-2 md:p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-150 relative group select-none border-b border-r border-slate-750
        ${!isCurrentMonth ? 'bg-slate-900/40 opacity-40 hover:opacity-75' : 'bg-slate-800/80 hover:bg-slate-750/90'}
        ${isSelected ? 'bg-indigo-950/40 ring-2 ring-indigo-500 z-10 shadow-lg shadow-indigo-500/10' : ''}
        ${isAllCompleted ? 'bg-emerald-950/20' : ''}
      `}
    >
      {/* Top row: Date Number & Completion Badge */}
      <div className="flex items-center justify-between gap-1">
        <span className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg text-xs md:text-sm font-semibold transition-all
          ${isToday 
            ? 'bg-indigo-500 text-white font-bold shadow-sm shadow-indigo-500/50' 
            : isSelected
            ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
            : isCurrentMonth ? 'text-slate-200 group-hover:text-white' : 'text-slate-500'
          }
        `}>
          {format(date, 'd')}
        </span>

        {/* Task completion badge */}
        {hasTasks && (
          <div className="flex items-center">
            {isAllCompleted ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={10} className="stroke-[2.5]" />
                <span className="hidden sm:inline">{completedTasks}/{totalTasks}</span>
              </span>
            ) : (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${
                completedTasks > 0 
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' 
                  : 'bg-slate-700/60 text-slate-400 border-slate-600/50'
              }`}>
                {completedTasks}/{totalTasks}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Middle row: Progress bar if day has tasks */}
      {hasTasks ? (
        <div className="my-1.5">
          <div className="w-full bg-slate-700/80 rounded-full h-1 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isAllCompleted 
                  ? 'bg-emerald-400' 
                  : completedTasks > 0 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-400' 
                  : 'bg-transparent'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="my-1.5 h-1" />
      )}

      {/* Bottom row: Category dots & extra indicator */}
      <div className="flex items-center justify-between pt-0.5 min-h-[14px]">
        {hasTasks ? (
          <div className="flex items-center gap-1 flex-wrap">
            {visibleCategories.map((cat, i) => (
              <span 
                key={i} 
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] || '#818cf8' }}
                title={cat}
              />
            ))}
            {extraCategoriesCount > 0 && (
              <span className="text-[9px] font-bold text-slate-400 leading-none">
                +{extraCategoriesCount}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-slate-600 font-normal italic">
            —
          </span>
        )}

        {hasTasks && (
          <span className="text-[9px] text-slate-500 hidden sm:inline font-mono">
            {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
          </span>
        )}
      </div>
    </div>
  );
};

export default CalendarDayCell;
