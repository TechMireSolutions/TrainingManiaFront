import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  BookOpen,
  ChevronDown,
  CheckCircle,
  Search,
  Upload,
  FileText,
  AlertCircle,
  X,        // For modal close
  Users     // For bulk tab icon
} from 'lucide-react';

const Enrollment = () => {
  const [candidates, setCandidates] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedTraining, setSelectedTraining] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  // Bulk Enrollment State
  const [activeTab, setActiveTab] = useState('single');
  const [csvFile, setCsvFile] = useState(null);
  const [parsedData, setParsedData] = useState({ existing: [], newCandidates: [] });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkTraining, setBulkTraining] = useState('');

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
      performEnrollment([selectedCandidate], trainingTitle);
      setSelectedCandidate('');
      setSelectedTraining('');
      alert(`Successfully enrolled ${selectedCandidate} in ${trainingTitle}`);
    }
  };

  const performEnrollment = (candidateList, trainingTitle) => {
    const newEnrollments = candidateList.map(candidate => ({
      id: Date.now() + Math.random(), // Ensure unique ID for batch
      candidate: candidate,
      training: trainingTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Enrolled'
    }));

    const updatedEnrollments = [...newEnrollments, ...enrollments];
    setEnrollments(updatedEnrollments);
    localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const processBulkFile = (e) => {
    e.preventDefault();
    if (!csvFile || !bulkTraining) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      // Simple CSV parser: assumes emails are in the first column or just a list of emails
      const lines = text.split(/\r\n|\n/).map(line => line.trim()).filter(line => line.length > 0);

      const existing = [];
      const newCandidates = [];

      lines.forEach(email => {
        // Basic cleanup and validation
        const cleanEmail = email.replace(/['",]/g, '').trim();
        if (!cleanEmail) return;

        if (candidates.includes(cleanEmail)) {
          existing.push(cleanEmail);
        } else {
          newCandidates.push(cleanEmail);
        }
      });

      setParsedData({ existing, newCandidates });
      setShowConfirmModal(true);
    };
    reader.readAsText(csvFile);
  };

  const confirmBulkEnrollment = (includeNew) => {
    const trainingTitle = trainings.find(t => t.id.toString() === bulkTraining)?.title || 'Unknown Training';
    let candidatesToEnroll = [...parsedData.existing];

    if (includeNew) {
      candidatesToEnroll = [...candidatesToEnroll, ...parsedData.newCandidates];

      // Update local storage with new candidates
      // Note: This logic depends on how candidates are stored (strings or objects). 
      // Based on useEffect, it seems to handle both but loads as strings.
      // We will append strings for now.
      const currentStored = JSON.parse(localStorage.getItem('candidates_list') || '[]');
      const updatedStored = [...currentStored, ...parsedData.newCandidates];
      localStorage.setItem('candidates_list', JSON.stringify(updatedStored));

      // Update local state
      setCandidates(prev => [...prev, ...parsedData.newCandidates]);
    }

    if (candidatesToEnroll.length > 0) {
      performEnrollment(candidatesToEnroll, trainingTitle);
      alert(`Successfully enrolled ${candidatesToEnroll.length} candidates.`);
    } else {
      alert("No candidates enrolled.");
    }

    setShowConfirmModal(false);
    setCsvFile(null);
    setBulkTraining('');
    setParsedData({ existing: [], newCandidates: [] });
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Enrollment</h2>
        <p className="text-slate-500">Register candidates to specific training modules.</p>
      </div>

      <div className="flex flex-col gap-8 mb-8">
        {/* Enrollment Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit w-full">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'single'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Single
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'bulk'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Bulk Upload
            </button>
          </div>

          <div className="max-w-2xl mx-auto">
            {activeTab === 'single' ? (
              <>
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
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Bulk Enrollment</h3>
                <form onSubmit={processBulkFile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Training</label>
                    <div className="relative">
                      <select
                        value={bulkTraining}
                        onChange={(e) => setBulkTraining(e.target.value)}
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Upload CSV File</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept=".csv, .txt"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center transition-all bg-slate-50 group-hover:bg-slate-100 group-hover:border-indigo-400">
                        {csvFile ? (
                          <>
                            <FileText className="w-8 h-8 text-indigo-600 mb-2" />
                            <p className="text-sm font-medium text-slate-900 truncate max-w-full px-4">{csvFile.name}</p>
                            <p className="text-xs text-slate-500">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-600 transition-colors" />
                            <p className="text-sm font-medium text-slate-700">Click to upload CSV</p>
                            <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      File should contain email addresses in new lines
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Process CSV
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Recent Enrollments List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full">
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Confirm Bulk Enrollment</h3>
                <p className="text-sm text-slate-500">Review candidates before proceeding.</p>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Existing Candidates */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-700 flex items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      Ready to Enroll
                    </h4>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {parsedData.existing.length}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto border border-slate-100">
                    {parsedData.existing.length > 0 ? (
                      <ul className="space-y-2">
                        {parsedData.existing.map((email, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
                            {email}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No existing candidates found in CSV.</p>
                    )}
                  </div>
                </div>

                {/* New Candidates */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-700 flex items-center">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                      New Candidates
                    </h4>
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {parsedData.newCandidates.length}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto border border-slate-100">
                    {parsedData.newCandidates.length > 0 ? (
                      <ul className="space-y-2">
                        {parsedData.newCandidates.map((email, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                            {email}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No new candidates found.</p>
                    )}
                  </div>
                </div>
              </div>

              {parsedData.newCandidates.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-blue-900 text-sm">New candidates detected</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      {parsedData.newCandidates.length} candidates in your list are not currently registered.
                      You can choose to add them to the system automatically or only enroll existing candidates.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>

              {parsedData.newCandidates.length > 0 && (
                <button
                  onClick={() => confirmBulkEnrollment(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors"
                >
                  Enroll Existing Only ({parsedData.existing.length})
                </button>
              )}

              <button
                onClick={() => confirmBulkEnrollment(true)}
                className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.95]"
              >
                {parsedData.newCandidates.length > 0
                  ? `Add & Enroll All (${parsedData.existing.length + parsedData.newCandidates.length})`
                  : `Confirm Enrollment (${parsedData.existing.length})`
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollment;
