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
import { Plus, HelpCircle } from 'lucide-react';

const Calendar = () => {
  const { selectedEnrollment } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  
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
      const res = await getProgress(selectedEnrollment._id);
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

  const handleToggle = async (taskId) => {
    try {
      await toggleComplete(taskId, selectedEnrollment._id);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Calendar</h2>
          <p className="text-sm text-slate-400">Plan and track your study schedule date by date</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate}
            tasksByDate={tasksByDate}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
          <div className="mt-4">
            <CategoryLegend />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-fit">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
            <div>
              <h3 className="text-lg font-bold text-white">
                {format(selectedDate, 'MMM d, yyyy')}
              </h3>
              <p className="text-xs text-indigo-400">Day {currentDayNum}</p>
            </div>
            {isCreator && (
              <div className="flex gap-1.5">
                <button 
                  onClick={() => openForm('task')}
                  className="flex items-center gap-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                >
                  <Plus size={14} />
                  <span>Task</span>
                </button>
                <button 
                  onClick={() => openForm('assessment')}
                  className="flex items-center gap-1 text-xs bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                >
                  <HelpCircle size={14} />
                  <span>Quiz</span>
                </button>
              </div>
            )}
          </div>
          
          {selectedDayTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <p className="mb-3">No tasks or assessments for Day {currentDayNum}.</p>
              {isCreator && (
                <div className="flex justify-center gap-2">
                  <button onClick={() => openForm('task')} className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-500/30">
                    + Add Task
                  </button>
                  <button onClick={() => openForm('assessment')} className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-rose-500/30">
                    + Add Quiz
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {[...selectedDayTasks]
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
