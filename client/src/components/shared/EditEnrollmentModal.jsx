import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const EditEnrollmentModal = ({ isOpen, onClose, enrollment, onSubmit }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    targetDate: '',
    label: ''
  });

  useEffect(() => {
    if (enrollment) {
      const sDate = enrollment.startDate ? format(new Date(enrollment.startDate), 'yyyy-MM-dd') : '';
      const tDate = enrollment.targetDate ? format(new Date(enrollment.targetDate), 'yyyy-MM-dd') : '';
      setFormData({
        startDate: sDate,
        targetDate: tDate,
        label: enrollment.label || 'Assessment'
      });
    }
  }, [enrollment, isOpen]);

  if (!isOpen || !enrollment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      startDate: new Date(formData.startDate),
      targetDate: new Date(formData.targetDate),
      label: formData.label
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Edit Prep Period</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Schedule Name / Label</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              placeholder="e.g. Assessment, Interview Round 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
            <input 
              required
              type="date" 
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target / Assessment Date</label>
            <input 
              required
              type="date" 
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={formData.targetDate}
              onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEnrollmentModal;
