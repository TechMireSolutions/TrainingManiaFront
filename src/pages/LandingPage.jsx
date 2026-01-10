import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#f8fafc]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-300/30 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -60, 0],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-300/20 rounded-full blur-[100px]"
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl w-full relative z-10"
      >
        <div className="text-center mb-20 space-y-6">
          <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-2 bg-white border border-indigo-100 rounded-full text-indigo-600 text-sm font-semibold tracking-wide mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
            TRAINING MANIA PORTAL
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-sm">
            Welcome Back
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Select your role to access the dashboard and manage your training modules efficiently.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          {/* Admin Card */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/login')}
            className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all duration-500 text-left overflow-hidden shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                Admin Portal
              </h2>
              <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                Manage users, create training modules, and track organization-wide progress.
              </p>
              
              <div className="flex items-center text-indigo-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                Login as Admin <ArrowRight className="w-6 h-6 ml-2" />
              </div>
            </div>
          </motion.button>

          {/* Candidate Card */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log('Candidate login not implemented yet')}
            className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all duration-500 text-left overflow-hidden shadow-xl shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:border-blue-200 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <User className="w-10 h-10 text-blue-500" />
              </div>
              
              <h2 className="text-4xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                Candidate Portal
              </h2>
              <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                Access your assigned training, view progress, and complete assessments.
              </p>
              
              <div className="flex items-center text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                Login as Candidate <ArrowRight className="w-6 h-6 ml-2" />
              </div>
            </div>
          </motion.button>
        </div>
        
        <motion.div variants={itemVariants} className="mt-20 text-center text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Training Mania. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
