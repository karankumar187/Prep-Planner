import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
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
      className={`h-[56px] md:h-[68px] p-1.5 md:p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 relative group select-none
        ${!isCurrentMonth ? 'bg-slate-900/40 opacity-30 hover:opacity-70' : 'bg-slate-850 hover:bg-slate-800'}
        ${isSelected ? 'bg-indigo-950/60 ring-1 ring-indigo-500/70 z-10' : ''}
        ${isAllCompleted ? 'bg-emerald-950/20' : ''}
      `}
    >
      {/* Top row: Date Number & Completion Badge */}
      <div className="flex items-center justify-between gap-1 leading-none">
        <span className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-md text-[11px] md:text-xs font-semibold transition-all
          ${isToday 
            ? 'bg-indigo-500 text-white font-bold shadow-sm shadow-indigo-500/40' 
            : isSelected
            ? 'bg-indigo-500/25 text-indigo-300 font-bold border border-indigo-500/40'
            : isCurrentMonth ? 'text-slate-300 group-hover:text-white' : 'text-slate-500'
          }
        `}>
          {format(date, 'd')}
        </span>

        {/* Task completion badge */}
        {hasTasks && (
          <div className="flex items-center">
            {isAllCompleted ? (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 leading-none">
                <CheckCircle2 size={9} className="stroke-[2.5]" />
                <span>{completedTasks}/{totalTasks}</span>
              </span>
            ) : (
              <span className={`px-1 py-0.5 rounded text-[9px] font-medium border leading-none ${
                completedTasks > 0 
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700/60'
              }`}>
                {completedTasks}/{totalTasks}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Middle: Progress bar if day has tasks */}
      {hasTasks ? (
        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden my-0.5 border border-slate-700/40">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isAllCompleted 
                ? 'bg-emerald-400' 
                : completedTasks > 0 
                ? 'bg-indigo-400' 
                : 'bg-transparent'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      ) : (
        <div className="h-1 my-0.5" />
      )}

      {/* Bottom row: Category dots */}
      <div className="flex items-center justify-between pt-0.5 min-h-[10px] leading-none">
        {hasTasks ? (
          <div className="flex items-center gap-1 flex-wrap">
            {visibleCategories.map((cat, i) => (
              <span 
                key={i} 
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] || '#818cf8' }}
                title={cat}
              />
            ))}
            {extraCategoriesCount > 0 && (
              <span className="text-[8px] font-bold text-slate-400 leading-none">
                +{extraCategoriesCount}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[9px] text-slate-700 font-normal select-none">
            —
          </span>
        )}

        {hasTasks && (
          <span className="text-[9px] text-slate-400 hidden sm:inline font-mono">
            {totalTasks}t
          </span>
        )}
      </div>
    </div>
  );
};

export default CalendarDayCell;
