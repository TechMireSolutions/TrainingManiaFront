import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('current_candidate');
    if (!stored) {
      navigate('/candidate/login');
      return;
    }
    setCandidate(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('current_candidate');
    navigate('/candidate/login');
  };

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">Training Mania</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">{candidate.email}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to your Dashboard!</h1>
          <p className="text-slate-500 max-w-lg mx-auto mb-8">
            You have successfully logged in. Your assigned training modules and assessments will appear here.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-medium">
            Status: Active Candidate
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;
