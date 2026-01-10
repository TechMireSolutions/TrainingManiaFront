import React, { useState } from 'react';
import { 
  Youtube, 
  FileText, 
  CheckSquare, 
  Type, 
  AlertCircle, 
  Save,
  Plus,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewTraining = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [contentType, setContentType] = useState('youtube');
  const [testTypes, setTestTypes] = useState({
    mcq: true,
    fillInBlanks: false
  });
  const [percentages, setPercentages] = useState({
    mcq: 100,
    fillInBlanks: 0
  });
  const [attempts, setAttempts] = useState(3);
  const [negativeMarking, setNegativeMarking] = useState(false);

  const handleTestTypeChange = (type) => {
    setTestTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create New Training</h2>
        <p className="text-slate-500">Configure the course content and assessment rules.</p>
      </div>

      <form className="space-y-8">
        {/* Title Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Training Module Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction to React"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg font-medium"
          />
        </div>

        {/* 1. Course Content Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">1</div>
            Course Content
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setContentType('youtube')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                contentType === 'youtube'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-100 hover:border-slate-200 text-slate-500'
              }`}
            >
              <Youtube className="w-8 h-8 mb-2" />
              <span className="font-semibold">YouTube Video</span>
            </button>
            
            <button
              type="button"
              onClick={() => setContentType('pdf')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                contentType === 'pdf'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-100 hover:border-slate-200 text-slate-500'
              }`}
            >
              <FileText className="w-8 h-8 mb-2" />
              <span className="font-semibold">PDF Document</span>
            </button>
          </div>

          <div className="space-y-4">
            {contentType === 'youtube' ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Video URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Upload PDF</label>
                {!selectedFile ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            alert('File size exceeds 10MB');
                            e.target.value = null;
                            return;
                          }
                          setSelectedFile(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                      <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-slate-400">PDF up to 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center overflow-hidden">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm mr-4 flex-shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Assessment Configuration */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">2</div>
            Assessment Structure
          </h3>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={testTypes.mcq}
                  onChange={() => handleTestTypeChange('mcq')}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-slate-900">Multiple Choice Questions</span>
                  <span className="text-xs text-slate-500">Standard MCQ format</span>
                </div>
              </div>
              {testTypes.mcq && (
                <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-slate-200 self-start sm:self-auto">
                  <input
                    type="number"
                    value={percentages.mcq}
                    onChange={(e) => setPercentages(prev => ({ ...prev, mcq: parseInt(e.target.value) || 0 }))}
                    className="w-16 text-right outline-none font-bold text-indigo-600"
                  />
                  <span className="ml-1 text-slate-400 font-medium">%</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={testTypes.fillInBlanks}
                  onChange={() => handleTestTypeChange('fillInBlanks')}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-slate-900">Fill in the Blanks</span>
                  <span className="text-xs text-slate-500">Text input based answers</span>
                </div>
              </div>
              {testTypes.fillInBlanks && (
                <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-slate-200 self-start sm:self-auto">
                  <input
                    type="number"
                    value={percentages.fillInBlanks}
                    onChange={(e) => setPercentages(prev => ({ ...prev, fillInBlanks: parseInt(e.target.value) || 0 }))}
                    className="w-16 text-right outline-none font-bold text-indigo-600"
                  />
                  <span className="ml-1 text-slate-400 font-medium">%</span>
                </div>
              )}
            </div>
            
            {(percentages.mcq + percentages.fillInBlanks !== 100) && (
              <div className="flex items-center text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 mr-2" />
                Total percentage must equal 100% (Current: {percentages.mcq + percentages.fillInBlanks}%)
              </div>
            )}
          </div>
        </div>

        {/* 3. Rules & Scoring */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">3</div>
            Rules & Scoring
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Total Marks</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Passing Marks</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                placeholder="e.g. 60"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Allowed Attempts</label>
              <input
                type="number"
                value={attempts}
                onChange={(e) => setAttempts(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center">
              <div className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${negativeMarking ? 'bg-indigo-600' : 'bg-slate-300'}`} onClick={() => setNegativeMarking(!negativeMarking)}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${negativeMarking ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-bold text-slate-900">Enable Negative Marking</span>
            </div>
            
            {negativeMarking && (
              <div className="flex items-center">
                <span className="text-sm text-slate-500 mr-3">Deduct per wrong answer:</span>
                <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-slate-200 w-24">
                  <input
                    type="number"
                    step="0.25"
                    className="w-full outline-none font-bold text-red-500"
                    placeholder="0.25"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => {
              if (!title.trim()) {
                alert('Please enter a training title');
                return;
              }
              // Validate percentages
              if (testTypes.mcq && testTypes.fillInBlanks && (percentages.mcq + percentages.fillInBlanks !== 100)) {
                alert('Total percentage must equal 100%');
                return;
              }
              
              // Prepare config
              const config = {
                mcq: testTypes.mcq ? percentages.mcq : 0,
                fib: testTypes.fillInBlanks ? percentages.fillInBlanks : 0
              };

              // Navigate to preview
              navigate('/admin/test-preview', { 
                state: { 
                  config,
                  title,
                  contentType
                } 
              });
            }}
            className="flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            Create Training Module
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTraining;
