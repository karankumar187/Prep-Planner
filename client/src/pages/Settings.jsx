import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { updateProfile, changePassword, getMySchedules, updateEnrollment, deleteEnrollment, updateSchedule } from '../utils/api';
import EditEnrollmentModal from '../components/shared/EditEnrollmentModal';
import ScheduleForm from '../components/explore/ScheduleForm';
import { Pencil, Trash2, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { enrollments, refreshEnrollments } = useContext(AppContext);
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [mySchedules, setMySchedules] = useState([]);
  
  // Modals state
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = () => {
    getMySchedules().then(res => setMySchedules(res.data)).catch(console.error);
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(name);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await changePassword(passwords.current, passwords.new);
      setMessage('Password changed successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setMessage('Failed to change password');
    }
  };

  const handleSaveEnrollmentDates = async (data) => {
    try {
      await updateEnrollment(editingEnrollment._id, data);
      await refreshEnrollments();
      setEditingEnrollment(null);
      setMessage('Enrollment dates updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update enrollment dates');
    }
  };

  const handleUnfollow = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to unfollow this schedule?')) {
      try {
        await deleteEnrollment(enrollmentId);
        await refreshEnrollments();
        setMessage('Unfollowed schedule');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveSchedule = async (data) => {
    try {
      await updateSchedule(editingSchedule._id, data);
      setEditingSchedule(null);
      fetchSchedules();
      await refreshEnrollments();
      setMessage('Schedule updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update schedule');
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      
      {message && <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-3 rounded-lg mb-6">{message}</div>}

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Profile</h3>
        <form onSubmit={handleProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email (Read Only)</label>
            <input type="email" value={user?.email || ''} disabled className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-400" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
          </div>
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">Update Profile</button>
        </form>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
        <form onSubmit={handlePassword} className="space-y-4 max-w-md">
          <input type="password" placeholder="Current Password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
          <input type="password" placeholder="New Password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
          <input type="password" placeholder="Confirm New Password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
          <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">Change Password</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-400" />
            <span>My Enrolled Schedules ({enrollments.length})</span>
          </h3>
          <div className="space-y-3">
            {enrollments.map(e => (
              <div key={e._id} className="p-3 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.schedule.color || '#6366f1' }} />
                    {e.schedule.companyName}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Label: <span className="text-slate-300 font-medium">{e.label || 'Assessment'}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {e.startDate ? format(new Date(e.startDate), 'MMM d, yyyy') : ''} → {e.targetDate ? format(new Date(e.targetDate), 'MMM d, yyyy') : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingEnrollment(e)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                    title="Edit Dates & Label"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => handleUnfollow(e._id)}
                    className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition-colors"
                    title="Unfollow Schedule"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {enrollments.length === 0 && <p className="text-slate-400 text-sm">Not enrolled in any schedules yet.</p>}
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-400" />
            <span>Created Schedules ({mySchedules.length})</span>
          </h3>
          <div className="space-y-3">
            {mySchedules.map(s => (
              <div key={s._id} className="p-3 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color || '#6366f1' }} />
                    {s.companyName}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.totalDays} Days • {s.followerCount || 0} Followers</div>
                </div>
                <button 
                  onClick={() => setEditingSchedule(s)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                  title="Edit Schedule Details"
                >
                  <Pencil size={14} />
                </button>
              </div>
            ))}
            {mySchedules.length === 0 && <p className="text-slate-400 text-sm">No schedules created yet.</p>}
          </div>
        </div>
      </div>

      <EditEnrollmentModal 
        isOpen={!!editingEnrollment}
        onClose={() => setEditingEnrollment(null)}
        enrollment={editingEnrollment}
        onSubmit={handleSaveEnrollmentDates}
      />

      <ScheduleForm 
        isOpen={!!editingSchedule}
        onClose={() => setEditingSchedule(null)}
        onSubmit={handleSaveSchedule}
        initialData={editingSchedule}
      />
    </div>
  );
};

export default Settings;
