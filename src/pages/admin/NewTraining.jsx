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

  // Video State
  const [videoType, setVideoType] = useState('youtube'); // 'youtube' or 'upload'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [testTypes, setTestTypes] = useState({
    mcq: true,
    fillInBlanks: false
  });
  const [percentages, setPercentages] = useState({
    mcq: 100,
    fillInBlanks: 0
  });
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [attempts, setAttempts] = useState(3);
  const [testDuration, setTestDuration] = useState(20);
  const [totalMarks, setTotalMarks] = useState('');
  const [passingMarks, setPassingMarks] = useState('');
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativeMarkingValue, setNegativeMarkingValue] = useState(0.25);

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
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg font-medium text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* 1. Course Content Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">1</div>
            Course Materials
          </h3>

          <div className="space-y-8">
            {/* PDF Upload (Required) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Training Manual (PDF) <span className="text-red-500">*</span>
              </label>
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
                    <p className="text-slate-900 font-medium">Click to upload training manual</p>
                    <p className="text-sm text-slate-500">Required: PDF up to 10MB</p>
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
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Video (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Video Tutorial (Optional)
              </label>

              {/* Video Type Toggle */}
              <div className="flex gap-4 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="videoType"
                    checked={videoType === 'youtube'}
                    onChange={() => setVideoType('youtube')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-slate-700 font-medium">Video Link</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="videoType"
                    checked={videoType === 'upload'}
                    onChange={() => setVideoType('upload')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-slate-700 font-medium">Upload Video</span>
                </label>
              </div>

              {videoType === 'youtube' ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Youtube className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="trainingvideo.mp4"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              ) : (
                <div>
                  {!videoFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                              alert('Video size exceeds 100MB');
                              e.target.value = null;
                              return;
                            }
                            setVideoFile(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                        <Youtube className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-900 font-medium">Click to upload video</p>
                        <p className="text-sm text-slate-500">MP4, WebM up to 100MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm mr-4 flex-shrink-0">
                          <Youtube className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{videoFile.name}</p>
                          <p className="text-xs text-slate-500">{(videoFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setVideoFile(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Assessment Configuration */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">2</div>
            Assessment Structure
          </h3>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={testTypes.mcq}
                  onChange={() => handleTestTypeChange('mcq')}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
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
                    className="w-16 text-right outline-none font-bold text-indigo-600 bg-transparent"
                  />
                  <span className="ml-1 text-slate-500 font-medium">%</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={testTypes.fillInBlanks}
                  onChange={() => handleTestTypeChange('fillInBlanks')}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
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
                    className="w-16 text-right outline-none font-bold text-indigo-600 bg-transparent"
                  />
                  <span className="ml-1 text-slate-500 font-medium">%</span>
                </div>
              )}
            </div>

            {(percentages.mcq + percentages.fillInBlanks !== 100) && (
              <div className="flex items-center text-amber-700 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                <AlertCircle className="w-4 h-4 mr-2" />
                Total percentage must equal 100% (Current: {percentages.mcq + percentages.fillInBlanks}%)
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Total Number of Questions</label>
              <input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 20)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900"
              />
            </div>
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
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900"
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Passing Marks</label>
              <input
                type="number"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900"
                placeholder="e.g. 60"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Allowed Attempts</label>
              <input
                type="number"
                value={attempts}
                onChange={(e) => setAttempts(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Test Duration (Mins)</label>
              <input
                type="number"
                value={testDuration}
                onChange={(e) => setTestDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center">
              <div className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${negativeMarking ? 'bg-indigo-600' : 'bg-slate-200'}`} onClick={() => setNegativeMarking(!negativeMarking)}>
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
                    value={negativeMarkingValue}
                    onChange={(e) => setNegativeMarkingValue(parseFloat(e.target.value))}
                    className="w-full outline-none font-bold text-red-500 bg-transparent"
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
              // Validate Required Fields (Title & PDF)
              if (!title.trim()) {
                alert('Please enter a training title');
                return;
              }
              if (!selectedFile) {
                alert('Please upload a PDF training manual');
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
                fib: testTypes.fillInBlanks ? percentages.fillInBlanks : 0,
                totalQuestions: totalQuestions
              };

              // Navigate to preview
              navigate('/admin/test-preview', {
                state: {
                  config,
                  title,
                  videoType,
                  videoUrl: videoType === 'youtube' ? videoUrl : (videoFile ? videoFile.name : ''),
                  pdfFile: selectedFile.name, // Required
                  settings: {
                    totalMarks: parseInt(totalMarks) || 100,
                    passingMarks: parseInt(passingMarks) || 40,
                    attempts: attempts,
                    testDuration: testDuration || 20,
                    negativeMarking: negativeMarking,
                    negativeMarkingValue: negativeMarking ? negativeMarkingValue : 0,
                    totalQuestions: totalQuestions
                  }
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
