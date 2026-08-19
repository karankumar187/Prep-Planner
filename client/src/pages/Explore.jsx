import React, { useState, useEffect, useContext } from 'react';
import { getExploreSchedules, createSchedule, updateSchedule, createEnrollment, getScheduleTasks, addScheduleTask, updateScheduleTask, deleteScheduleTask } from '../utils/api';
import ScheduleCard from '../components/explore/ScheduleCard';
import ScheduleForm from '../components/explore/ScheduleForm';
import ScheduleDetail from '../components/explore/ScheduleDetail';
import FollowModal from '../components/explore/FollowModal';
import TaskForm from '../components/dashboard/TaskForm';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { isUserCreator } from '../utils/constants';

const Explore = () => {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [viewingSchedule, setViewingSchedule] = useState(null);
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);

  // Task form state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDayForTask, setSelectedDayForTask] = useState(1);
  
  const { enrollments, refreshEnrollments, setSelectedEnrollment } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await getExploreSchedules();
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdateSchedule = async (data) => {
    try {
      if (editingSchedule) {
        const res = await updateSchedule(editingSchedule._id, data);
        setIsFormOpen(false);
        setEditingSchedule(null);
        fetchSchedules();
        if (viewingSchedule && viewingSchedule._id === editingSchedule._id) {
          setViewingSchedule(res.data);
        }
      } else {
        const res = await createSchedule(data);
        setIsFormOpen(false);
        fetchSchedules();
        await refreshEnrollments();
        handleView(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = async (schedule) => {
    try {
      const res = await getScheduleTasks(schedule._id);
      setScheduleTasks(res.data);
      setViewingSchedule(schedule);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshTasks = async () => {
    if (viewingSchedule) {
      const res = await getScheduleTasks(viewingSchedule._id);
      setScheduleTasks(res.data);
    }
  };

  const handleTaskSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateScheduleTask(viewingSchedule._id, editingTask._id, data);
      } else {
        await addScheduleTask(viewingSchedule._id, data);
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteScheduleTask(viewingSchedule._id, taskId);
        refreshTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFollowSubmit = async (data) => {
    try {
      const res = await createEnrollment({ scheduleId: viewingSchedule._id, ...data });
      await refreshEnrollments();
      setSelectedEnrollment(res.data);
      setIsFollowModalOpen(false);
      setViewingSchedule(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (viewingSchedule) {
    const isFollowing = enrollments.some(e => e.schedule._id === viewingSchedule._id);
    const isCreator = isUserCreator(viewingSchedule, user);

    return (
      <div>
        <ScheduleDetail 
          schedule={viewingSchedule}
          tasks={scheduleTasks}
          onBack={() => setViewingSchedule(null)}
          onFollow={() => setIsFollowModalOpen(true)}
          isFollowing={isFollowing}
          isCreator={isCreator}
          onAddTask={(day) => { setSelectedDayForTask(day); setEditingTask(null); setIsTaskFormOpen(true); }}
          onEditTask={(task) => { setEditingTask(task); setIsTaskFormOpen(true); }}
          onDeleteTask={handleDeleteTask}
          onEditSchedule={(sched) => { setEditingSchedule(sched); setIsFormOpen(true); }}
        />

        <TaskForm 
          isOpen={isTaskFormOpen}
          onClose={() => { setIsTaskFormOpen(false); setEditingTask(null); }}
          onSubmit={handleTaskSubmit}
          initialData={editingTask}
          dayNumber={selectedDayForTask}
        />

        <ScheduleForm 
          isOpen={isFormOpen} 
          onClose={() => { setIsFormOpen(false); setEditingSchedule(null); }} 
          onSubmit={handleCreateOrUpdateSchedule}
          initialData={editingSchedule}
        />

        <FollowModal 
          isOpen={isFollowModalOpen} 
          onClose={() => setIsFollowModalOpen(false)} 
          schedule={viewingSchedule} 
          onSubmit={handleFollowSubmit} 
        />
      </div>
    );
  }

  const filtered = schedules.filter(s => 
    s.companyName.toLowerCase().includes(search.toLowerCase()) || 
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Explore Schedules</h2>
        <button 
          onClick={() => { setEditingSchedule(null); setIsFormOpen(true); }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Create Schedule
        </button>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search company or goal..." 
          className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(schedule => {
          const isFollowing = enrollments.some(e => e.schedule._id === schedule._id);
          return (
            <ScheduleCard 
              key={schedule._id} 
              schedule={schedule} 
              onView={handleView}
              onFollow={() => { setViewingSchedule(schedule); setIsFollowModalOpen(true); }}
              isFollowing={isFollowing}
            />
          );
        })}
        {filtered.length === 0 && <div className="text-slate-400 col-span-full">No schedules found.</div>}
      </div>

      <ScheduleForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingSchedule(null); }} 
        onSubmit={handleCreateOrUpdateSchedule} 
        initialData={editingSchedule}
      />
      
      <FollowModal 
        isOpen={isFollowModalOpen} 
        onClose={() => setIsFollowModalOpen(false)} 
        schedule={viewingSchedule} 
        onSubmit={handleFollowSubmit} 
      />
    </div>
  );
};

export default Explore;
