import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const CandidateLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('LOGIN'); // 'LOGIN' or 'SET_PASSWORD'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login State
  const [email, setEmail] = useState('');
  const [credential, setCredential] = useState(''); // Can be Access Code or Password

  // Set Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const candidates = JSON.parse(localStorage.getItem('candidates_list') || '[]');
      const candidate = candidates.find(c => {
        const cEmail = typeof c === 'string' ? c : c.email;
        return cEmail && cEmail.toLowerCase() === email.toLowerCase();
      });

      if (!candidate) {
        setError('Candidate not found. Please contact your administrator.');
        setIsLoading(false);
        return;
      }

      // Check if first time login (no password set)
      if (!candidate.password) {
        // Verify Access Code
        if (candidate.code === credential.toUpperCase()) {
          setStep('SET_PASSWORD');
          setError('');
        } else {
          setError('Invalid Access Code. Please check your email.');
        }
      } else {
        // Verify Password
        if (candidate.password === credential) {
          // Success - Redirect to Dashboard
          localStorage.setItem('current_candidate', JSON.stringify(candidate));
          navigate('/candidate/dashboard');
        } else {
          setError('Invalid Password. Please try again.');
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const handleSetPassword = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Update candidate in localStorage
      const candidates = JSON.parse(localStorage.getItem('candidates_list') || '[]');
      const updatedCandidates = candidates.map(c => {
        const cEmail = typeof c === 'string' ? c : c.email;
        if (cEmail && cEmail.toLowerCase() === email.toLowerCase()) {
          // Verify we preserve object structure or convert string to object
          return typeof c === 'string'
            ? { email: c, password: newPassword }
            : { ...c, password: newPassword };
        }
        return c;
      });

      localStorage.setItem('candidates_list', JSON.stringify(updatedCandidates));

      // Set current session
      const candidate = updatedCandidates.find(c => {
        const cEmail = typeof c === 'string' ? c : c.email;
        return cEmail && cEmail.toLowerCase() === email.toLowerCase();
      });
      localStorage.setItem('current_candidate', JSON.stringify(candidate));

      navigate('/candidate/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-white p-8 pb-0 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mx-auto mb-6 transform rotate-3">
            <span className="text-white font-bold text-3xl">T</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Candidate Portal</h2>
          <p className="text-slate-500">
            {step === 'LOGIN' ? 'Access your training and assessments' : 'Secure your account'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {step === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Access Code / Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    placeholder="Enter code or password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">
                  First time? Use the Access Code sent to your email.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-5">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-6">
                <div className="flex items-center gap-3 text-indigo-700 font-medium mb-1">
                  <CheckCircle className="w-5 h-5" />
                  Access Code Verified
                </div>
                <p className="text-sm text-indigo-600/80 ml-8">
                  Please set a secure password for future logins.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Set Password & Login <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>


      </div>
    </div>
  );
};

export default CandidateLogin;
