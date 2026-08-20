import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/dashboard/TaskCard';
import TaskForm from '../components/dashboard/TaskForm';
import { getProgress, toggleComplete, addScheduleTask, updateScheduleTask, deleteScheduleTask } from '../utils/api';
import { CATEGORIES, isUserCreator } from '../utils/constants';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const { selectedEnrollment } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDayForNewTask, setSelectedDayForNewTask] = useState(1);

  useEffect(() => {
    if (selectedEnrollment) fetchData();
  }, [selectedEnrollment]);

  const fetchData = async () => {
    try {
      const res = await getProgress(selectedEnrollment._id);
      setTasks(res.data);
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
    if (window.confirm('Delete this task?')) {
      try {
        await deleteScheduleTask(selectedEnrollment.schedule._id, taskId);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!selectedEnrollment) return <div className="text-white p-6">Please select a schedule.</div>;

  const isCreator = isUserCreator(selectedEnrollment.schedule, user);

  let filtered = tasks.filter(t => {
    if (filter === 'Completed' && !t.completed) return false;
    if (filter === 'Pending' && t.completed) return false;
    if (category !== 'All' && t.scheduleTask.category !== category) return false;
    if (search && !t.scheduleTask.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, t) => {
    const day = t.scheduleTask.dayNumber;
    if (!acc[day]) acc[day] = [];
    acc[day].push(t);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">All Tasks</h2>
          <p className="text-sm text-slate-400">{selectedEnrollment.schedule.companyName} — {selectedEnrollment.schedule.title}</p>
        </div>
        {isCreator && (
          <button 
            onClick={() => { setSelectedDayForNewTask(1); setEditingTask(null); setIsTaskFormOpen(true); }}
            className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white flex-1 min-w-[200px]"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          value={category} onChange={e => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          value={filter} onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="space-y-6">
        {Object.keys(grouped).sort((a,b)=>a-b).map(day => (
          <div key={day} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-indigo-400">Day {day}</h3>
              {isCreator && (
                <button 
                  onClick={() => { setSelectedDayForNewTask(Number(day)); setEditingTask(null); setIsTaskFormOpen(true); }}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded transition-colors"
                >
                  + Add Task to Day {day}
                </button>
              )}
            </div>
            <div className="space-y-3">
              {[...grouped[day]]
                .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
                .map(task => (
                  <TaskCard 
                    key={task.scheduleTask._id} 
                    task={task} 
                    enrollmentId={selectedEnrollment._id}
                    onToggleComplete={handleToggle}
                    onMCQSubmitted={fetchData}
                    onEdit={isCreator ? (t) => { setEditingTask(t); setIsTaskFormOpen(true); } : null}
                    onDelete={isCreator ? handleDelete : null}
                  />
                ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400 border border-slate-700">
            No tasks found.
          </div>
        )}
      </div>

      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => { setIsTaskFormOpen(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
        dayNumber={selectedDayForNewTask}
      />
    </div>
  );
};

export default Tasks;
