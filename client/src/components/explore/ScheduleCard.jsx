import React, { useState } from 'react';
import { Users, User, Mail, ShieldCheck } from 'lucide-react';

const ScheduleCard = ({ schedule, onFollow, onView, isFollowing }) => {
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

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl flex flex-col hover:border-slate-600 transition-all hover:shadow-lg relative">
      <div 
        className="h-2 w-full rounded-t-xl" 
        style={{ backgroundColor: schedule.color || '#6366f1' }} 
      />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{schedule.companyName}</h3>
          <span className="text-xs font-semibold bg-slate-700/80 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full">
            {schedule.totalDays} Days
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{schedule.title}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            
            {/* Followers Popover Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setShowFollowersTip(true)}
              onMouseLeave={() => setShowFollowersTip(false)}
            >
              <button 
                type="button"
                className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-700/50 hover:text-indigo-300 transition-colors cursor-pointer"
                title="View followers"
              >
                <Users size={14} className="text-indigo-400" />
                <span className="font-semibold text-slate-300">{followerCount}</span>
              </button>

              {/* Followers Hover Popover */}
              {showFollowersTip && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
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

            {/* Creator Popover Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCreatorTip(true)}
              onMouseLeave={() => setShowCreatorTip(false)}
            >
              <button 
                type="button"
                className="flex items-center gap-1 py-1 px-1.5 rounded hover:bg-slate-700/50 hover:text-white transition-colors cursor-pointer truncate max-w-[130px]"
              >
                <User size={13} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">By <strong className="text-slate-300 font-medium">{creatorName}</strong></span>
              </button>

              {/* Creator Hover Card */}
              {showCreatorTip && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shadow flex-shrink-0">
                      {getInitials(creatorName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-white truncate">{creatorName}</p>
                        <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" title="Schedule Author" />
                      </div>
                      {creatorEmail ? (
                        <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <Mail size={10} />
                          {creatorEmail}
                        </p>
                      ) : (
                        <p className="text-[10px] text-indigo-400 mt-0.5">Author</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Role</span>
                    <span className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded font-medium border border-indigo-500/20">Creator</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => onView(schedule)} 
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              View
            </button>
            <button 
              onClick={() => !isFollowing && onFollow(schedule)}
              disabled={isFollowing}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isFollowing 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm hover:shadow'
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
