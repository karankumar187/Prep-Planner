import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import StatCard from '../components/dashboard/StatCard';
import TaskCard from '../components/dashboard/TaskCard';
import TaskForm from '../components/dashboard/TaskForm';
import { ClipboardList, Clock, Flame, TrendingUp, Plus, HelpCircle, BookOpen } from 'lucide-react';
import { getOverview, getProgress, toggleComplete, addScheduleTask, updateScheduleTask, deleteScheduleTask } from '../utils/api';
import { isUserCreator } from '../utils/constants';
import { format } from 'date-fns';

const Dashboard = () => {
  const { selectedEnrollment } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [todayTasks, setTodayTasks] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultType, setDefaultType] = useState('task');
  const [currentDayNum, setCurrentDayNum] = useState(1);

  useEffect(() => {
    if (selectedEnrollment) {
      fetchData();
    }
  }, [selectedEnrollment]);

  const fetchData = async () => {
    try {
      const statsRes = await getOverview(selectedEnrollment._id);
      setStats(statsRes.data);

      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const todayDate = new Date(todayStr);
      const start = new Date(selectedEnrollment.startDate);
      start.setHours(0, 0, 0, 0);

      const diffTime = todayDate - start;
      const dayNum = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCurrentDayNum(dayNum > 0 ? dayNum : 1);

      const progressRes = await getProgress(selectedEnrollment._id, todayStr);
      setTodayTasks(progressRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (taskId, actualMins) => {
    try {
      await toggleComplete(taskId, selectedEnrollment._id, actualMins);
      fetchData();
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
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this item?')) {
      try {
        await deleteScheduleTask(selectedEnrollment.schedule._id, taskId);
        fetchData();
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

  if (!selectedEnrollment) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to Prep Tracker!</h2>
        <p className="text-slate-400 mb-8 max-w-md">You haven't enrolled in any schedules yet. Explore available schedules or create your own to get started.</p>
        <Link to="/explore" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Explore Schedules
        </Link>
      </div>
    );
  }

  const isCreator = isUserCreator(selectedEnrollment.schedule, user);

  return (
    <div>
      <GreetingHeader />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ClipboardList} label="Tasks Completed" value={`${stats.completed || 0}/${stats.totalTasks || 0}`} color="indigo" />
        <StatCard icon={Clock} label="Study Time" value={`${stats.studyHours?.toFixed(1) || 0}h`} sublabel="Total tracked" color="amber" />
        <StatCard icon={Flame} label="Day Streak" value={stats.currentStreak || 0} sublabel={`Best: ${stats.bestStreak || 0}`} color="red" />
        <StatCard icon={TrendingUp} label="Progress" value={`${stats.completionRate || 0}%`} color="green" />
      </div>

      <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-2 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-white">Today's Schedule</h2>
          <p className="text-sm text-slate-400">Day {currentDayNum}</p>
        </div>
        {isCreator && (
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => openForm('task')}
              className="flex items-center gap-1.5 text-xs md:text-sm bg-indigo-500 text-white hover:bg-indigo-600 px-3 py-1.5 rounded-lg font-medium transition-colors shadow"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
            <button 
              onClick={() => openForm('reading')}
              className="flex items-center gap-1.5 text-xs md:text-sm bg-purple-500 text-white hover:bg-purple-600 px-3 py-1.5 rounded-lg font-medium transition-colors shadow"
            >
              <BookOpen size={16} />
              <span>Add Reading</span>
            </button>
            <button 
              onClick={() => openForm('assessment')}
              className="flex items-center gap-1.5 text-xs md:text-sm bg-rose-500 text-white hover:bg-rose-600 px-3 py-1.5 rounded-lg font-medium transition-colors shadow"
            >
              <HelpCircle size={16} />
              <span>Add Quiz</span>
            </button>
          </div>
        )}
      </div>

      {todayTasks.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
          <p className="text-slate-400 mb-3">No tasks, reading notes, or assessments assigned for Day {currentDayNum}. Take a break or add items!</p>
          {isCreator && (
            <div className="flex justify-center gap-2 flex-wrap">
              <button onClick={() => openForm('task')} className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-500/30">
                + Add Task
              </button>
              <button onClick={() => openForm('reading')} className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-500/30">
                + Add Reading Material
              </button>
              <button onClick={() => openForm('assessment')} className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-rose-500/30">
                + Add MCQ Quiz
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {[...todayTasks]
            .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
            .map(task => (
              <TaskCard 
                key={task.scheduleTask._id} 
                task={task} 
                enrollmentId={selectedEnrollment._id}
                onToggleComplete={handleToggle}
                onMCQSubmitted={fetchData}
                onEdit={isCreator ? (t) => openForm(t.taskType || (t.readingContent ? 'reading' : t.category === 'MCQ Assessment' ? 'assessment' : 'task'), t) : null}
                onDelete={isCreator ? handleDelete : null}
              />
            ))}
        </div>
      )}

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

export default Dashboard;
