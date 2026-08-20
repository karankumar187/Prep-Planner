import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import { CATEGORY_COLORS } from '../../utils/constants';

const CalendarDayCell = ({ date, isToday, isSelected, isCurrentMonth, tasks, onClick }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const isAllCompleted = totalTasks > 0 && completedTasks === totalTasks;
  const hasTasks = totalTasks > 0;
  const hasPartial = hasTasks && completedTasks > 0 && !isAllCompleted;
  const completionPercentage = hasTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Unique categories for this day
  const uniqueCategories = Array.from(
    new Set(tasks.map(t => t.scheduleTask?.category).filter(Boolean))
  );

  const visibleCategories = uniqueCategories.slice(0, 3);
  const extraCategoriesCount = uniqueCategories.length - visibleCategories.length;

  // Compute color scheme based on whether it's TODAY vs OTHER DATES
  const getBadgeStyle = () => {
    if (!hasTasks) return null;

    if (isToday) {
      // Today: Special Vibrant Indigo Theme
      return {
        badge: 'bg-indigo-500/25 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-500/20',
        bar: 'bg-gradient-to-r from-indigo-500 to-indigo-400',
        textCount: 'text-indigo-300 font-semibold'
      };
    }

    if (isAllCompleted) {
      // Other Dates - 100% Completed: Emerald Green
      return {
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        bar: 'bg-emerald-400 shadow-sm shadow-emerald-500/30',
        textCount: 'text-emerald-400 font-medium'
      };
    }

    if (hasPartial) {
      // Other Dates - Partially in progress: Cyan / Sky Blue
      return {
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        bar: 'bg-gradient-to-r from-cyan-500 to-teal-400',
        textCount: 'text-cyan-300 font-medium'
      };
    }

    // Other Dates - Planned / Not Started: Warm Amber / Gold
    return {
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      bar: 'bg-slate-700',
      textCount: 'text-amber-300/80 font-medium'
    };
  };

  const styleConfig = getBadgeStyle();

  return (
    <div 
      onClick={onClick}
      className={`h-[58px] md:h-[70px] p-1.5 md:p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 relative group select-none
        ${!isCurrentMonth ? 'bg-slate-900/40 opacity-30 hover:opacity-70' : 'bg-slate-850 hover:bg-slate-800'}
        ${isToday ? 'bg-indigo-950/20' : ''}
        ${isSelected ? 'bg-indigo-950/60 ring-1 ring-indigo-500/70 z-10' : ''}
        ${isAllCompleted && !isToday ? 'bg-emerald-950/15' : ''}
      `}
    >
      {/* Top row: Date Number & Completion Badge */}
      <div className="flex items-center justify-between gap-1 leading-none">
        <span className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-md text-[11px] md:text-xs font-semibold transition-all
          ${isToday 
            ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/50 ring-1 ring-indigo-300/40' 
            : isSelected
            ? 'bg-indigo-500/25 text-indigo-300 font-bold border border-indigo-500/40'
            : isCurrentMonth ? 'text-slate-300 group-hover:text-white' : 'text-slate-500'
          }
        `}>
          {format(date, 'd')}
        </span>

        {/* Task completion badge with distinct colors */}
        {hasTasks && styleConfig && (
          <div className="flex items-center">
            {isAllCompleted ? (
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold border leading-none ${styleConfig.badge}`}>
                <CheckCircle2 size={9} className="stroke-[2.5]" />
                <span>{completedTasks}/{totalTasks}</span>
              </span>
            ) : (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border leading-none ${styleConfig.badge}`}>
                {completedTasks}/{totalTasks}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Middle: Progress bar */}
      {hasTasks && styleConfig ? (
        <div className="w-full bg-slate-900/80 rounded-full h-1 overflow-hidden my-0.5 border border-slate-700/40">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${styleConfig.bar}`}
            style={{ width: `${Math.max(completionPercentage, 0)}%` }}
          />
        </div>
      ) : (
        <div className="h-1 my-0.5" />
      )}

      {/* Bottom row: Category dots & Total tasks text */}
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

        {hasTasks && styleConfig && (
          <span className={`text-[9px] hidden sm:inline font-mono ${styleConfig.textCount}`}>
            {totalTasks}t
          </span>
        )}
      </div>
    </div>
  );
};

export default CalendarDayCell;
