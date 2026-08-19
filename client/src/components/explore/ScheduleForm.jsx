import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#06b6d4', '#f43f5e', '#f59e0b', '#14b8a6', '#84cc16', '#ec4899', '#8b5cf6', '#6366f1'];

const ScheduleForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    description: '',
    totalDays: 30,
    color: '#6366f1'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        title: initialData.title || '',
        description: initialData.description || '',
        totalDays: initialData.totalDays || 30,
        color: initialData.color || '#6366f1'
      });
    } else {
      setFormData({
        companyName: '',
        title: '',
        description: '',
        totalDays: 30,
        color: '#6366f1'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Schedule' : 'Create New Schedule'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Company/Goal Name</label>
            <input required type="text" placeholder="e.g. Google, Frontend Prep" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500"
              value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input required type="text" placeholder="e.g. 30 Days of Code" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Total Days</label>
              <input required type="number" min="1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500"
                value={formData.totalDays} onChange={e => setFormData({...formData, totalDays: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Theme Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setFormData({...formData, color: c})}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${formData.color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
              {initialData ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
