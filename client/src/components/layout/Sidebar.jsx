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

  // Mobile Bottom Nav Links (Top 5 essential destinations)
  const mobileBottomLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Home' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/tasks', icon: ListTodo, label: 'Tasks' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/settings', icon: Settings2, label: 'Settings' }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (hidden on small/mobile screens < 768px) */}
      <aside className="hidden md:flex w-64 bg-slate-800 h-screen fixed flex-col border-r border-slate-700 z-30">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-6">Prep Tracker</h1>
          <ScheduleSwitcher />
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-500/20 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
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
            <span className="truncate max-w-[150px] text-sm font-medium">{user?.name}</span>
            <button onClick={logout} className="p-1 hover:text-white transition-colors text-slate-400" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR (visible on screens < 768px) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800/95 backdrop-blur-md border-b border-slate-700 z-40 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-white">Prep Tracker</h1>
        </div>
        <div className="flex items-center gap-2 max-w-[200px]">
          <ScheduleSwitcher />
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (fixed at bottom on screens < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/80 z-40 px-2 py-1 flex items-center justify-around shadow-2xl">
        {mobileBottomLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all ${
                isActive 
                  ? 'text-indigo-400 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-full transition-transform ${isActive ? 'bg-indigo-500/20 scale-110' : ''}`}>
                  <link.icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
