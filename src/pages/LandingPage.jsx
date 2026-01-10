import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl opacity-60 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-5xl w-full">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold tracking-wide mb-2 border border-indigo-100">
            TRAINING MANIA PORTAL
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
            Select your role to access the dashboard and manage your training modules efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Card */}
          <button
            onClick={() => navigate('/admin/login')}
            className="group relative bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transition-all duration-500 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                Admin Portal
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Manage users, create training modules, and track organization-wide progress.
              </p>
              
              <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                Login as Admin <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </button>

          {/* Candidate Card */}
          <button
            onClick={() => console.log('Candidate login not implemented yet')}
            className="group relative bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 transition-all duration-500 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-500">
                <User className="w-8 h-8" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Candidate Portal
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Access your assigned training, view progress, and complete assessments.
              </p>
              
              <div className="flex items-center text-slate-600 font-semibold group-hover:text-blue-600 group-hover:translate-x-2 transition-all">
                Login as Candidate <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </button>
        </div>
        
        <div className="mt-16 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Training Mania. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
