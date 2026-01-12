import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Search, 
  Download, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch real data from localStorage
    const storedResults = JSON.parse(localStorage.getItem('test_results') || '[]');
    setReports(storedResults);
  }, []);

  const handleExportCSV = () => {
    if (reports.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Candidate", "Training Module", "Score", "Total Marks", "Correct", "Wrong", "Skipped", "Status", "Date"];
    const csvRows = [
      headers.join(','), // Header row
      ...reports.map(row => [
        row.candidate,
        `"${row.training}"`, // Quote training name to handle commas
        row.score,
        row.totalMarks,
        row.correct,
        row.wrong,
        row.skipped,
        row.status,
        `"${row.date}"`
      ].join(','))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "performance_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reports.filter(report => 
    report.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.training.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Reports</h2>
          <p className="text-slate-500">View detailed test results and candidate performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">All Test Results</h3>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search candidate or training..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Training Module</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Performance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{report.candidate}</td>
                    <td className="px-6 py-4 text-slate-500">{report.training}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${report.score >= 40 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {report.score}/{report.totalMarks}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4 text-xs">
                        <div className="flex items-center text-emerald-600" title="Correct">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {report.correct}
                        </div>
                        <div className="flex items-center text-red-600" title="Wrong">
                          <XCircle className="w-3 h-3 mr-1" />
                          {report.wrong}
                        </div>
                        <div className="flex items-center text-slate-500" title="Skipped">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {report.skipped}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'Passed' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {report.status === 'Passed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{report.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No test results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filteredReports.length} results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
