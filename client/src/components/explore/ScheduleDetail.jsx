import React from 'react';
import { ArrowLeft, Clock, Pencil, Trash2, Edit } from 'lucide-react';
import CategoryPill from '../shared/CategoryPill';
import { PRIORITY_COLORS } from '../../utils/constants';

const ScheduleDetail = ({ 
  schedule, 
  tasks, 
  onBack, 
  onFollow, 
  isFollowing, 
  isCreator, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onEditSchedule 
}) => {
  const tasksByDay = tasks.reduce((acc, task) => {
    if (!acc[task.dayNumber]) acc[task.dayNumber] = [];
    acc[task.dayNumber].push(task);
    return acc;
  }, {});

  const days = Array.from({ length: schedule.totalDays }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: schedule.color || '#6366f1' }} />
            <h2 className="text-2xl font-bold text-white truncate">{schedule.companyName}</h2>
          </div>
          <p className="text-slate-400 text-sm truncate">{schedule.title}</p>
        </div>

        <div className="flex items-center gap-3">
          {isCreator && onEditSchedule && (
            <button 
              onClick={() => onEditSchedule(schedule)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Edit size={16} />
              <span>Edit Schedule</span>
            </button>
          )}

          {!isCreator && (
            <button 
              onClick={() => !isFollowing && onFollow(schedule)}
              disabled={isFollowing}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                isFollowing ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow Schedule'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
        <p className="text-slate-300 mb-4">{schedule.description || 'No description provided.'}</p>
        <div className="flex gap-6 text-sm text-slate-400">
          <div><strong className="text-white">{schedule.totalDays}</strong> Days</div>
          <div><strong className="text-white">{tasks.length}</strong> Tasks</div>
          <div><strong className="text-white">{schedule.followerCount || 0}</strong> Followers</div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Curriculum & Tasks</h3>
          {isCreator && (
            <button onClick={() => onAddTask(1)} className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
              + Add Task
            </button>
          )}
        </div>

        {days.map(day => (
          <div key={day} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-indigo-400">Day {day}</h4>
              {isCreator && (
                <button onClick={() => onAddTask(day)} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded transition-colors">
                  + Add Task
                </button>
              )}
            </div>
            
            {(!tasksByDay[day] || tasksByDay[day].length === 0) ? (
              <p className="text-sm text-slate-500 italic">No tasks for this day.</p>
            ) : (
              <div className="space-y-3">
                {tasksByDay[day].map(task => (
                  <div key={task._id} className="group bg-slate-900/50 p-3 rounded-lg flex items-center justify-between border border-slate-700/50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }} title={`Priority: ${task.priority}`} />
                        <span className="text-white font-medium">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <CategoryPill category={task.category} />
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} />{task.estimatedMinutes}m</span>
                      </div>
                    </div>

                    {isCreator && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEditTask && (
                          <button onClick={() => onEditTask(task)} className="p-1.5 text-slate-400 hover:text-indigo-400 rounded bg-slate-800" title="Edit Task">
                            <Pencil size={14} />
                          </button>
                        )}
                        {onDeleteTask && (
                          <button onClick={() => onDeleteTask(task._id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded bg-slate-800" title="Delete Task">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleDetail;
