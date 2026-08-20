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
    <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col gap-5">
      {/* Calendar Header with Navigation & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{format(currentMonth, "MMMM yyyy")}</h2>
            <p className="text-xs text-slate-400 font-medium">Select any date to view and manage daily tasks</p>
          </div>
        </div>

        {/* Navigation buttons & Today shortcut */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-600/50"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-900/60 border border-slate-700 rounded-lg p-0.5">
            <button 
              onClick={prevMonth} 
              className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextMonth} 
              className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Month Summary Bar */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-750 text-xs">
        <div className="flex items-center gap-2.5 px-2">
          <ListTodo size={16} className="text-indigo-400 flex-shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Monthly Tasks</div>
            <div className="font-bold text-slate-100 text-sm">{totalMonthTasks}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-x border-slate-800">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Completed</div>
            <div className="font-bold text-emerald-400 text-sm">{completedMonthTasks}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2">
          <TrendingUp size={16} className="text-indigo-400 flex-shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Completion Rate</div>
            <div className="font-bold text-slate-100 text-sm">{monthCompletionRate}%</div>
          </div>
        </div>
      </div>

      {/* 7-column Calendar Grid */}
      <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-inner bg-slate-900/50">
        {/* Week Days Row */}
        <div className="grid grid-cols-7 border-b border-slate-700/80 bg-slate-850/80">
          {weekDays.map(day => (
            <div 
              key={day} 
              className="py-2.5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Matrix */}
        <div className="grid grid-cols-7">
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
