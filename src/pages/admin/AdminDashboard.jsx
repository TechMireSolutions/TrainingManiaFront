import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  MoreVertical,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import NewTraining from './NewTraining';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    navigate('/');
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Training</h1>
              <span className="text-indigo-600 font-semibold text-sm">Mania</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-2">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</div>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          <NavItem id="new-training" icon={Plus} label="New Training" />
          <NavItem id="modules" icon={BookOpen} label="Training Modules" />
          <NavItem id="candidates" icon={Users} label="Candidates" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center bg-slate-100/50 rounded-xl px-4 py-2.5 w-96 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none focus:outline-none w-full text-slate-700 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'new-training' ? (
            <NewTraining />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select "New Training" from the sidebar to start.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
