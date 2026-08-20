import React, { useState, useEffect, useContext } from 'react';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CategoryLegend from '../components/calendar/CategoryLegend';
import TaskCard from '../components/dashboard/TaskCard';
import TaskForm from '../components/dashboard/TaskForm';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { getProgress, toggleComplete, addScheduleTask, updateScheduleTask, deleteScheduleTask } from '../utils/api';
import { isUserCreator } from '../utils/constants';
import { format } from 'date-fns';
import { Plus, HelpCircle, Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

const Calendar = () => {
  const { selectedEnrollment } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'completed'
  
  // Creator task editing state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultType, setDefaultType] = useState('task');

  useEffect(() => {
    if (selectedEnrollment) {
      fetchMonthData();
    }
  }, [selectedEnrollment, currentMonth]);

  useEffect(() => {
    if (selectedEnrollment) {
      fetchDayData();
    }
  }, [selectedEnrollment, selectedDate]);

  const fetchMonthData = async () => {
    try {
      const res = await getProgress(selectedEnrollment._id, 'all');
      const grouped = {};
      const start = new Date(selectedEnrollment.startDate);
      start.setHours(0, 0, 0, 0);
      
      res.data.forEach(task => {
        const d = new Date(start);
        d.setDate(d.getDate() + task.scheduleTask.dayNumber - 1);
        const dStr = format(d, 'yyyy-MM-dd');
        if (!grouped[dStr]) grouped[dStr] = [];
        grouped[dStr].push(task);
      });
      setTasksByDate(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDayData = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const res = await getProgress(selectedEnrollment._id, dateStr);
      setSelectedDayTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (taskId, actualMins) => {
    try {
      await toggleComplete(taskId, selectedEnrollment._id, actualMins);
      fetchDayData();
      fetchMonthData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateScheduleTask(selectedEnrollment.schedule._id, editingTask._id, data);
      } else {
        await addScheduleTask(selectedEnrollment.schedule._id, data);
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
      fetchDayData();
      fetchMonthData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this item?')) {
      try {
        await deleteScheduleTask(selectedEnrollment.schedule._id, taskId);
        fetchDayData();
        fetchMonthData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openForm = (type, taskToEdit = null) => {
    setDefaultType(type);
    setEditingTask(taskToEdit);
    setIsTaskFormOpen(true);
  };

  if (!selectedEnrollment) return <div className="text-white p-6">Please select a schedule first.</div>;

  const isCreator = isUserCreator(selectedEnrollment.schedule, user);

  // Calculate dayNumber for selectedDate
  const startDate = new Date(selectedEnrollment.startDate);
  startDate.setHours(0, 0, 0, 0);
  const selDate = new Date(selectedDate);
  selDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((selDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const currentDayNum = diffDays > 0 ? diffDays : 1;

  // Compute stats for selected day
  const totalDayTasks = selectedDayTasks.length;
  const completedDayTasks = selectedDayTasks.filter(t => t.completed).length;
  const pendingDayTasks = totalDayTasks - completedDayTasks;
  const dayCompletionRate = totalDayTasks > 0 ? Math.round((completedDayTasks / totalDayTasks) * 100) : 0;
  const totalEstimatedMins = selectedDayTasks.reduce((acc, t) => acc + (t.scheduleTask?.estimatedMinutes || 0), 0);

  // Filter tasks based on activeFilter
  const filteredTasks = selectedDayTasks.filter(t => {
    if (activeFilter === 'pending') return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Calendar & Daily Planner</h1>
          <p className="text-xs text-slate-400">Track curriculum date-by-date and monitor your consistency</p>
        </div>

        {isCreator && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => openForm('task')}
              className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
            <button 
              onClick={() => openForm('assessment')}
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-3 py-1.5 rounded-xl font-semibold shadow-md shadow-rose-600/20 transition-all active:scale-95"
            >
              <HelpCircle size={14} />
              <span>Add Quiz</span>
            </button>
          </div>
        )}
      </div>
      
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Side: Calendar Grid & Legend (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <CalendarGrid 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate}
            tasksByDate={tasksByDate}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
          <CategoryLegend />
        </div>
        
        {/* Right Side: Clean & Minimal Daily Tasks Sidebar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            
            {/* Header of Selected Day */}
            <div className="flex justify-between items-start pb-2.5 border-b border-slate-700/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                    Day {currentDayNum}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    {totalEstimatedMins}m est.
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mt-0.5">
                  {format(selectedDate, 'EEEE, MMM d, yyyy')}
                </h3>
              </div>

              {/* Progress Percentage Badge */}
              <div className="flex flex-col items-end">
                <span className="text-lg font-black text-indigo-400">
                  {dayCompletionRate}%
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {completedDayTasks}/{totalDayTasks} Done
                </span>
              </div>
            </div>

            {/* Daily Progress Bar */}
            {totalDayTasks > 0 && (
              <div className="w-full bg-slate-900/60 rounded-full h-1.5 overflow-hidden border border-slate-700/40">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    dayCompletionRate === 100 
                      ? 'bg-emerald-400' 
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${dayCompletionRate}%` }}
                />
              </div>
            )}

            {/* Filter Tabs */}
            {totalDayTasks > 0 && (
              <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-700/40 text-xs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`flex-1 py-1 rounded-lg font-semibold text-xs transition-all ${
                    activeFilter === 'all' 
                      ? 'bg-slate-700 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({totalDayTasks})
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`flex-1 py-1 rounded-lg font-semibold text-xs transition-all ${
                    activeFilter === 'pending' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pending ({pendingDayTasks})
                </button>
                <button
                  onClick={() => setActiveFilter('completed')}
                  className={`flex-1 py-1 rounded-lg font-semibold text-xs transition-all ${
                    activeFilter === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Done ({completedDayTasks})
                </button>
              </div>
            )}

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-900/30 rounded-xl border border-dashed border-slate-700/50 text-slate-400 text-xs">
                {totalDayTasks === 0 ? (
                  <>
                    <CalendarIcon size={24} className="mx-auto mb-1.5 text-slate-600" />
                    <p className="font-medium text-slate-300">No tasks for Day {currentDayNum}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 mb-3">You can add custom tasks below.</p>
                    {isCreator && (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openForm('task')} 
                          className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-semibold hover:bg-indigo-500/30 transition-colors"
                        >
                          + Add Task
                        </button>
                        <button 
                          onClick={() => openForm('assessment')} 
                          className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-lg font-semibold hover:bg-rose-500/30 transition-colors"
                        >
                          + Add Quiz
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-500/60" />
                    <p className="font-medium text-slate-300">No {activeFilter} tasks found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Switch tabs to view other day items.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-[470px] overflow-y-auto pr-1 custom-scrollbar">
                {[...filteredTasks]
                  .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
                  .map(task => (
                    <TaskCard 
                      key={task.scheduleTask._id} 
                      task={task} 
                      enrollmentId={selectedEnrollment._id}
                      onToggleComplete={handleToggle}
                      onMCQSubmitted={() => { fetchDayData(); fetchMonthData(); }}
                      onEdit={isCreator ? (t) => openForm(t.category === 'MCQ Assessment' || (t.mcqs && t.mcqs.length > 0) ? 'assessment' : 'task', t) : null}
                      onDelete={isCreator ? handleDelete : null}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => { setIsTaskFormOpen(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
        dayNumber={currentDayNum}
        defaultTaskType={defaultType}
      />
    </div>
  );
};

export default Calendar;
