import React, { useState } from 'react';
import { ArrowLeft, Clock, Pencil, Trash2, Edit, ExternalLink, Users, User, Mail, ShieldCheck, ChevronDown, ChevronUp, Code2, HelpCircle } from 'lucide-react';
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
  const [selectedTrack, setSelectedTrack] = useState('all'); // 'all' | 'java' | 'cpp'
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showCreatorTip, setShowCreatorTip] = useState(false);
  const [showFollowersTip, setShowFollowersTip] = useState(false);

  const creatorName = schedule.creatorId?.name || schedule.creator?.name || 'User';
  const creatorEmail = schedule.creatorId?.email || schedule.creator?.email || '';
  const followers = schedule.followers || [];
  const followerCount = schedule.followerCount !== undefined ? schedule.followerCount : followers.length;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Filter tasks based on language track
  const filteredTasks = tasks.filter(task => {
    if (selectedTrack === 'java') return task.category !== 'C++';
    if (selectedTrack === 'cpp') return task.category !== 'Java';
    return true;
  });

  const tasksByDay = filteredTasks.reduce((acc, task) => {
    if (!acc[task.dayNumber]) acc[task.dayNumber] = [];
    acc[task.dayNumber].push(task);
    return acc;
  }, {});

  const days = Array.from({ length: schedule.totalDays }, (_, i) => i + 1);

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Header */}
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
                isFollowing ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow Schedule'}
            </button>
          )}
        </div>
      </div>

      {/* Schedule Meta Card with Creator & Followers Hover */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700 shadow-md">
        <p className="text-slate-300 mb-4 text-sm leading-relaxed">{schedule.description || 'No description provided.'}</p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 pt-3 border-t border-slate-700/60">
          <div><strong className="text-white text-base">{schedule.totalDays}</strong> Days</div>
          <div><strong className="text-white text-base">{tasks.length}</strong> Total Tasks</div>
          
          {/* Followers Popover in Detail View */}
          <div 
            className="relative"
            onMouseEnter={() => setShowFollowersTip(true)}
            onMouseLeave={() => setShowFollowersTip(false)}
          >
            <button type="button" className="flex items-center gap-1.5 hover:text-indigo-300 transition-colors cursor-pointer py-0.5">
              <Users size={16} className="text-indigo-400" />
              <span><strong className="text-white text-base">{followerCount}</strong> Followers</span>
            </button>

            {showFollowersTip && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Users size={13} className="text-indigo-400" />
                    <span>Followers ({followerCount})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Following</span>
                </div>

                {followers.length === 0 ? (
                  <div className="text-slate-400 text-xs py-2 text-center">
                    {followerCount > 0 ? `${followerCount} student(s) following` : 'No followers yet'}
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {followers.map((f, idx) => (
                      <div key={f._id || idx} className="flex items-center gap-2.5 p-1 rounded hover:bg-slate-800/60 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {getInitials(f.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-200 truncate">{f.name}</p>
                          {f.email && <p className="text-[10px] text-slate-400 truncate">{f.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Creator Popover in Detail View */}
          <div 
            className="relative"
            onMouseEnter={() => setShowCreatorTip(true)}
            onMouseLeave={() => setShowCreatorTip(false)}
          >
            <button type="button" className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-0.5">
              <User size={16} className="text-slate-400" />
              <span>Created by <strong className="text-white">{creatorName}</strong></span>
            </button>

            {showCreatorTip && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shadow flex-shrink-0">
                    {getInitials(creatorName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-white truncate">{creatorName}</p>
                      <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" title="Author" />
                    </div>
                    {creatorEmail && (
                      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <Mail size={10} />
                        {creatorEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Role</span>
                  <span className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded font-medium border border-indigo-500/20">Schedule Creator</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Curriculum & Tasks Section with Language Track Filter */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Daily Smart Curriculum</h3>
            <p className="text-xs text-slate-400 mt-0.5">4 DSA + 2 SQL + Core Theory & Language Track Assignments</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Track Filter Buttons */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
                <Code2 size={13} />
                <span>Track:</span>
              </span>
              <button
                onClick={() => setSelectedTrack('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedTrack === 'all'
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Tracks
              </button>
              <button
                onClick={() => setSelectedTrack('java')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedTrack === 'java'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                ☕ Java
              </button>
              <button
                onClick={() => setSelectedTrack('cpp')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedTrack === 'cpp'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-sky-400'
                }`}
              >
                ⚡ C++
              </button>
            </div>

            {isCreator && (
              <button onClick={() => onAddTask(1)} className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors shadow">
                + Add Task
              </button>
            )}
          </div>
        </div>

        {/* Days List */}
        {days.map(day => (
          <div key={day} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h4 className="font-bold text-indigo-300 text-base">Day {day}</h4>
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                  {(tasksByDay[day] || []).length} tasks
                </span>
              </div>
              {isCreator && (
                <button onClick={() => onAddTask(day)} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded transition-colors">
                  + Add Task
                </button>
              )}
            </div>
            
            {(!tasksByDay[day] || tasksByDay[day].length === 0) ? (
              <p className="text-sm text-slate-500 italic py-2">No tasks for this track on this day.</p>
            ) : (
              <div className="space-y-3">
                {tasksByDay[day].map(task => {
                  const isExpanded = expandedTaskId === task._id;
                  const hasDetails = task.readingContent || (task.mcqs && task.mcqs.length > 0);

                  return (
                    <div 
                      key={task._id} 
                      className="bg-slate-900/60 hover:bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/60 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: PRIORITY_COLORS[task.priority] || '#3b82f6' }} 
                              title={`Priority: ${task.priority}`} 
                            />
                            <span className="text-white font-medium text-sm sm:text-base leading-snug">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <CategoryPill category={task.category} />
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={12} />
                              {task.estimatedMinutes}m
                            </span>

                            {task.link && (
                              <a 
                                href={task.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 transition-colors"
                              >
                                Practice Link <ExternalLink size={11} />
                              </a>
                            )}

                            {task.mcqs && task.mcqs.length > 0 && (
                              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                <HelpCircle size={11} />
                                {task.mcqs.length} MCQs
                              </span>
                            )}

                            {hasDetails && (
                              <button
                                onClick={() => toggleExpand(task._id)}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors ml-auto"
                              >
                                {isExpanded ? 'Hide Notes' : 'View Notes & Tips'}
                                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                              </button>
                            )}
                          </div>
                        </div>

                        {isCreator && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
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

                      {/* Expandable Notes / Reading Content */}
                      {isExpanded && hasDetails && (
                        <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2 bg-slate-950/40 p-3 rounded-lg">
                          {task.readingContent && (
                            <div>
                              <span className="font-semibold text-indigo-400 block mb-1">Algorithmic Approach & Key Notes:</span>
                              <p className="leading-relaxed text-slate-300">{task.readingContent}</p>
                            </div>
                          )}

                          {task.mcqs && task.mcqs.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-800/80">
                              <span className="font-semibold text-emerald-400 block mb-1.5">Interactive Concept Check ({task.mcqs.length} questions):</span>
                              <div className="space-y-2">
                                {task.mcqs.map((q, qIdx) => (
                                  <div key={qIdx} className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
                                    <p className="font-medium text-slate-200 mb-1.5">{qIdx + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                                      {q.options.map((opt, optIdx) => (
                                        <div 
                                          key={optIdx} 
                                          className={`p-1.5 rounded ${
                                            optIdx === q.correctOption 
                                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium' 
                                              : 'bg-slate-800/50 text-slate-400'
                                          }`}
                                        >
                                          {optIdx === q.correctOption && '✓ '} {opt}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleDetail;
