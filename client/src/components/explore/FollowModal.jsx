import React, { useState } from 'react';
import { format, addDays } from 'date-fns';

const FollowModal = ({ isOpen, onClose, schedule, onSubmit }) => {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [label, setLabel] = useState('Assessment');

  if (!isOpen || !schedule) return null;

  const targetDate = addDays(new Date(startDate), schedule.totalDays);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ startDate, targetType: label });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-md border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-2">Follow "{schedule.companyName}"</h2>
        <p className="text-slate-400 text-sm mb-6">Set up your tracking for this schedule.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
            <input 
              required type="date" 
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500"
              value={startDate} onChange={e => setStartDate(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Goal Label (e.g. Interview, Assessment)</label>
            <input 
              required type="text" 
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500"
              value={label} onChange={e => setLabel(e.target.value)} 
            />
          </div>
          
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mt-2">
            <div className="text-sm text-indigo-300">Target Completion Date</div>
            <div className="text-lg font-bold text-indigo-400">{format(targetDate, 'PPP')}</div>
            <div className="text-xs text-indigo-300/70 mt-1">Based on {schedule.totalDays} days schedule</div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">Start Tracking</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowModal;
