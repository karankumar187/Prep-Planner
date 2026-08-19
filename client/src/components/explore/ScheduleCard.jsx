import React from 'react';
import { Users, CalendarDays } from 'lucide-react';

const ScheduleCard = ({ schedule, onFollow, onView, isFollowing }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col hover:border-slate-600 transition-colors">
      <div className="h-2 w-full" style={{ backgroundColor: schedule.color || '#6366f1' }} />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{schedule.companyName}</h3>
          <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {schedule.totalDays} Days
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{schedule.title}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Users size={14} /> {schedule.followerCount}</span>
            <span className="flex items-center gap-1 truncate max-w-[100px]" title={schedule.creator?.name}>By {schedule.creator?.name || 'User'}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onView(schedule)} className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors">
              View
            </button>
            <button 
              onClick={() => !isFollowing && onFollow(schedule)}
              disabled={isFollowing}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                isFollowing ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
