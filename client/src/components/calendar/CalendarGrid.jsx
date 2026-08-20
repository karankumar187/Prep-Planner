import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, ListTodo, TrendingUp } from 'lucide-react';
import CalendarDayCell from './CalendarDayCell';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const CalendarGrid = ({ selectedDate, onSelectDate, tasksByDate, currentMonth, setCurrentMonth }) => {
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onSelectDate(today);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate monthly stats
  let totalMonthTasks = 0;
  let completedMonthTasks = 0;

  days.forEach(day => {
    if (isSameMonth(day, monthStart)) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayTasks = tasksByDate[dateStr] || [];
      totalMonthTasks += dayTasks.length;
      completedMonthTasks += dayTasks.filter(t => t.completed).length;
    }
  });

  const monthCompletionRate = totalMonthTasks > 0 
    ? Math.round((completedMonthTasks / totalMonthTasks) * 100) 
    : 0;

  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 shadow-xl flex flex-col gap-3.5">
      {/* Calendar Header with Navigation & Quick Actions */}
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CalendarIcon size={16} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-tight">{format(currentMonth, "MMMM yyyy")}</h2>
          </div>
        </div>

        {/* Navigation buttons & Today shortcut */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={goToToday}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-600/40"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-900/60 border border-slate-700/60 rounded-lg p-0.5">
            <button 
              onClick={prevMonth} 
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={nextMonth} 
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Month Summary Bar */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-slate-900/60 rounded-xl border border-slate-700/40 text-xs">
        <div className="flex items-center gap-2 px-1.5">
          <ListTodo size={14} className="text-indigo-400 flex-shrink-0" />
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="text-slate-400 text-[11px]">Tasks:</span>
            <span className="font-bold text-slate-100 text-xs">{totalMonthTasks}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1.5 border-x border-slate-800">
          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="text-slate-400 text-[11px]">Done:</span>
            <span className="font-bold text-emerald-400 text-xs">{completedMonthTasks}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1.5">
          <TrendingUp size={14} className="text-indigo-400 flex-shrink-0" />
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="text-slate-400 text-[11px]">Rate:</span>
            <span className="font-bold text-slate-100 text-xs">{monthCompletionRate}%</span>
          </div>
        </div>
      </div>

      {/* 7-column Calendar Grid with soft dark dividers (no harsh white outlines) */}
      <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-inner bg-slate-900/40">
        {/* Week Days Header Row */}
        <div className="grid grid-cols-7 border-b border-slate-700/50 bg-slate-850">
          {weekDays.map(day => (
            <div 
              key={day} 
              className="py-1.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Matrix with 1px subtle dark gap */}
        <div className="grid grid-cols-7 gap-[1px] bg-slate-700/30">
          {days.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const tasks = tasksByDate[dateStr] || [];

            return (
              <CalendarDayCell 
                key={idx}
                date={day}
                isToday={isToday}
                isSelected={isSelected}
                isCurrentMonth={isCurrentMonth}
                tasks={tasks}
                onClick={() => onSelectDate(day)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
