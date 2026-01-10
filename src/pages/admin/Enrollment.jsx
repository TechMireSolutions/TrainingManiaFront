import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  BookOpen, 
  ChevronDown, 
  CheckCircle,
  Search
} from 'lucide-react';

const Enrollment = () => {
  const [candidates, setCandidates] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedTraining, setSelectedTraining] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    // Load Candidates
    const storedCandidates = JSON.parse(localStorage.getItem('candidates_list') || '[]');
    // Handle both string arrays (legacy) and object arrays (new)
    const candidateEmails = storedCandidates.map(item => 
      typeof item === 'string' ? item : item.email
    );
    setCandidates(candidateEmails);

    // Load Trainings (Mock + LocalStorage)
    const savedTrainings = JSON.parse(localStorage.getItem('training_modules') || '[]');
    const initialTrainings = [
      { id: 1, title: "WordPress Fundamentals" },
      { id: 2, title: "Cyber Security Basics" },
      { id: 3, title: "Advanced React Patterns" }
    ];
    setTrainings([...savedTrainings, ...initialTrainings]);

    // Load Enrollments
    const storedEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    setEnrollments(storedEnrollments);
  }, []);

  const handleEnroll = (e) => {
    e.preventDefault();
    if (selectedCandidate && selectedTraining) {
      const trainingTitle = trainings.find(t => t.id.toString() === selectedTraining)?.title || 'Unknown Training';
      
      const newEnrollment = {
        id: Date.now(),
        candidate: selectedCandidate,
        training: trainingTitle,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Enrolled'
      };

      const updatedEnrollments = [newEnrollment, ...enrollments];
      setEnrollments(updatedEnrollments);
      localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
      
      setSelectedCandidate('');
      setSelectedTraining('');
      alert(`Successfully enrolled ${selectedCandidate} in ${trainingTitle}`);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Enrollment</h2>
        <p className="text-slate-500">Register candidates to specific training modules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Enrollment Form */}
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-bold text-slate-900 mb-6">New Enrollment</h3>
          
          <form onSubmit={handleEnroll} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Candidate</label>
              <div className="relative">
                <select
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none appearance-none transition-all text-slate-900"
                  required
                >
                  <option value="" className="text-slate-500">Choose a candidate...</option>
                  {candidates.map((email, index) => (
                    <option key={index} value={email}>{email}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
              {candidates.length === 0 && (
                <p className="text-xs text-amber-600 mt-2">No candidates found. Please add candidates first.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Training</label>
              <div className="relative">
                <select
                  value={selectedTraining}
                  onChange={(e) => setSelectedTraining(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none appearance-none transition-all text-slate-900"
                  required
                >
                  <option value="" className="text-slate-500">Choose a training...</option>
                  {trainings.map((training) => (
                    <option key={training.id} value={training.id}>{training.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center"
            >
              <UserCheck className="w-5 h-5 mr-2" />
              Enroll Candidate
            </button>
          </form>
        </div>

        {/* Recent Enrollments List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Enrollments</h3>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-48 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Training Module</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{enrollment.candidate}</td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                          {enrollment.training}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{enrollment.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {enrollment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                      No enrollments yet. Use the form to enroll candidates.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
