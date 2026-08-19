import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, ListTodo, Tags, Settings2, Compass, LogOut } from 'lucide-react';
import ScheduleSwitcher from '../shared/ScheduleSwitcher';
import CountdownWidget from '../shared/CountdownWidget';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/tasks', icon: ListTodo, label: 'Tasks' },
    { to: '/categories', icon: Tags, label: 'Categories' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/settings', icon: Settings2, label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-slate-800 h-screen fixed flex flex-col border-r border-slate-700">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white mb-6">Prep Tracker</h1>
        <ScheduleSwitcher />
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
              }`
            }
          >
            <link.icon size={20} />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <CountdownWidget />
        <div className="mt-4 flex items-center justify-between text-slate-300 px-2">
          <span className="truncate max-w-[150px]">{user?.name}</span>
          <button onClick={logout} className="p-1 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
