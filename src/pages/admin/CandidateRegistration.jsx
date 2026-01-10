import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  UploadCloud, 
  FileText, 
  Mail, 
  CheckCircle,
  X
} from 'lucide-react';

const CandidateRegistration = () => {
  const [email, setEmail] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([
    { email: "alex.johnson@example.com", date: "Just now", method: "Manual" },
    { email: "sarah.williams@example.com", date: "2 mins ago", method: "Manual" },
    { email: "bulk_import_jan10.csv", date: "1 hour ago", method: "Bulk Upload (45 users)" }
  ]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('candidates_list') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        // Check if stored data is array of strings (old format) or objects (new format)
        const formatted = stored.map(item => {
          if (typeof item === 'string') {
            return { email: item, date: 'Previously added', method: 'Unknown' };
          }
          return item;
        }).filter(item => item && item.email); // Filter out invalid items
        
        setRecentCandidates(formatted);
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
      // Fallback to default or empty if error
    }
  }, []);

  const saveToLocalStorage = (newCandidates) => {
    try {
      const existing = JSON.parse(localStorage.getItem('candidates_list') || '[]');
      let existingFormatted = [];

      if (Array.isArray(existing)) {
        existingFormatted = existing.map(item => {
          if (typeof item === 'string') {
            return { email: item, date: 'Previously added', method: 'Unknown' };
          }
          return item;
        }).filter(item => item && item.email);
      }
      
      // Filter out duplicates based on email
      const existingEmails = new Set(existingFormatted.map(c => c.email));
      const uniqueNew = newCandidates.filter(c => !existingEmails.has(c.email));
      
      const updatedList = [...uniqueNew, ...existingFormatted];
      localStorage.setItem('candidates_list', JSON.stringify(updatedList));
    } catch (error) {
      console.error("Failed to save candidates:", error);
      alert("Failed to save candidate data. Please try clearing your browser cache if this persists.");
    }
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (email) {
      const newCandidate = { email, date: "Just now", method: "Manual" };
      setRecentCandidates([newCandidate, ...recentCandidates]);
      saveToLocalStorage([newCandidate]);
      setEmail('');
      alert(`Candidate ${email} added successfully!`);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === "text/csv" || file.name.endsWith('.csv')) {
      setCsvFile(file);
    } else {
      alert("Please upload a CSV file.");
    }
  };

  const handleBulkUpload = () => {
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        // Split by newline, trim whitespace, and filter for valid-looking emails
        // Also skip the header row if it exists (simple check if first row is 'email')
        const lines = text.split(/\r?\n/);
        const emails = lines
          .map(line => line.trim())
          .filter(line => line && line.includes('@') && line.toLowerCase() !== 'email');
        
        const newCandidates = emails.map(email => ({
          email,
          date: "Just now",
          method: "Bulk Upload"
        }));

        setRecentCandidates(prev => [...newCandidates, ...prev]);
        saveToLocalStorage(newCandidates);
        setCsvFile(null);
        alert(`Successfully processed ${emails.length} candidates from CSV!`);
      };
      reader.readAsText(csvFile);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Candidate Registration</h2>
        <p className="text-slate-500">Add new candidates to the system manually or via bulk upload.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Manual Registration */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mr-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Manual Entry</h3>
              <p className="text-sm text-slate-500">Add a single candidate</p>
            </div>
          </div>

          <form onSubmit={handleManualAdd}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Candidate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@company.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
            >
              Add Candidate
            </button>
          </form>
        </div>

        {/* Bulk Upload */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mr-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bulk Upload</h3>
              <p className="text-sm text-slate-500">Import from CSV file</p>
            </div>
          </div>

          {!csvFile ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-900 font-semibold mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500">CSV files only (max 5MB)</p>
              </label>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-emerald-500 mr-3" />
                  <div>
                    <p className="font-semibold text-slate-900">{csvFile.name}</p>
                    <p className="text-xs text-slate-500">{(csvFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button onClick={() => setCsvFile(null)} className="text-slate-400 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleBulkUpload}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Process Import
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Registrations</h3>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
            {recentCandidates.length} Candidates
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {recentCandidates.map((candidate, index) => {
            if (!candidate || !candidate.email) return null;
            return (
              <div key={index} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center overflow-hidden mr-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-4 flex-shrink-0">
                    {(candidate.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{candidate.email}</p>
                    <p className="text-xs text-slate-500">{candidate.method}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-slate-500 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span className="hidden sm:inline">{candidate.date}</span>
                </div>
              </div>
            );
          })}
          {recentCandidates.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No candidates registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateRegistration;
