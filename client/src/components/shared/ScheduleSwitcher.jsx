import React, { useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ScheduleSwitcher = () => {
  const { enrollments, selectedEnrollment, setSelectedEnrollment } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!enrollments || enrollments.length === 0) {
    return (
      <button 
        onClick={() => navigate('/explore')}
        className="w-full flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg p-2 hover:bg-indigo-500/20 transition-colors text-sm font-medium"
      >
        <span>Find a Schedule</span>
        <Plus size={16} />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 hover:bg-slate-700/50 transition-colors text-sm text-left"
      >
        <div className="flex items-center gap-2 truncate">
          <div 
            className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
            style={{ backgroundColor: selectedEnrollment?.schedule?.color || '#6366f1' }}
          />
          <span className="truncate font-medium">{selectedEnrollment?.schedule?.companyName || 'Select Schedule'}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="max-h-48 overflow-y-auto py-1">
            {enrollments.map((enrollment) => (
              <button
                key={enrollment._id}
                onClick={() => {
                  setSelectedEnrollment(enrollment);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 p-2.5 text-sm text-left hover:bg-slate-700/50 transition-colors ${selectedEnrollment?._id === enrollment._id ? 'bg-slate-700/30' : ''}`}
              >
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: enrollment.schedule.color || '#6366f1' }}
                />
                <div className="truncate">
                  <div className="text-white font-medium truncate">{enrollment.schedule.companyName}</div>
                  <div className="text-xs text-slate-400 truncate">{enrollment.schedule.title}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-1 border-t border-slate-700">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate('/explore');
              }}
              className="w-full flex items-center gap-2 p-2 text-sm text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors"
            >
              <Plus size={16} />
              <span>Add Schedule</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSwitcher;
