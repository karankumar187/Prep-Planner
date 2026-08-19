import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Pencil } from 'lucide-react';
import { updateEnrollment } from '../../utils/api';
import EditEnrollmentModal from './EditEnrollmentModal';

const CountdownWidget = () => {
  const { selectedEnrollment, refreshEnrollments } = useContext(AppContext);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (selectedEnrollment) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const target = new Date(selectedEnrollment.targetDate);
      target.setHours(0, 0, 0, 0);

      const start = new Date(selectedEnrollment.startDate);
      start.setHours(0, 0, 0, 0);

      const total = Math.max(1, Math.ceil((target - start) / (1000 * 60 * 60 * 24)));
      setTotalDays(total);

      const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
      setDaysRemaining(diff >= 0 ? diff : 0);
    }
  }, [selectedEnrollment]);

  if (!selectedEnrollment) {
    return <div className="text-sm text-slate-400 p-2 text-center bg-slate-900/50 rounded-lg">No schedule selected</div>;
  }

  const elapsedPercent = totalDays > 0 ? Math.min(100, Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100)) : 0;

  const handleSaveDates = async (data) => {
    try {
      await updateEnrollment(selectedEnrollment._id, data);
      await refreshEnrollments();
      setIsEditOpen(false);
    } catch (err) {
      console.error('Failed to update prep dates:', err);
    }
  };

  return (
    <>
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 relative group">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs text-slate-400 uppercase tracking-wider truncate max-w-[140px]" title={selectedEnrollment.label}>
            {selectedEnrollment.label || 'Target Date'}
          </div>
          <button 
            onClick={() => setIsEditOpen(true)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Edit prep period"
          >
            <Pencil size={14} />
          </button>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-white">{daysRemaining}</span>
            <span className="text-slate-400 text-sm ml-1">days left</span>
          </div>
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-700" />
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={14 * 2 * Math.PI} strokeDashoffset={14 * 2 * Math.PI - (elapsedPercent / 100) * 14 * 2 * Math.PI} className="text-indigo-500 transition-all duration-1000" />
            </svg>
          </div>
        </div>
      </div>

      <EditEnrollmentModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        enrollment={selectedEnrollment} 
        onSubmit={handleSaveDates} 
      />
    </>
  );
};

export default CountdownWidget;
