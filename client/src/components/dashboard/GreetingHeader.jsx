import React, { useContext } from 'react';
import { Bell } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const GreetingHeader = () => {
  const { user } = useContext(AuthContext);
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const today = new Date().toLocaleDateString('en-US', dateOptions);

  return (
    <div className="flex justify-between items-center mb-6 md:mb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
          {greeting}, {user?.name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p className="text-slate-400 text-xs md:text-sm">{today}</p>
      </div>
      <button className="p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-400 hover:text-white transition-colors" title="Notifications">
        <Bell size={18} />
      </button>
    </div>
  );
};

export default GreetingHeader;
