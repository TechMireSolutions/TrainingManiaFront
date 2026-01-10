import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Shuffle, Save, CheckCircle } from 'lucide-react';
import { mcqPool, fibPool } from '../../data/questionBank';

const GeneratedTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { config, title, contentType } = location.state || { 
    config: { mcq: 70, fib: 30 },
    title: 'Untitled Training',
    contentType: 'youtube'
  };

  const [questions, setQuestions] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const generateQuestions = () => {
    const totalQuestions = 20; // Fixed total for MVP
    const mcqCount = Math.round((totalQuestions * config.mcq) / 100);
    const fibCount = totalQuestions - mcqCount;

    // Random Selection Logic
    const shuffledMcqs = [...mcqPool].sort(() => 0.5 - Math.random());
    const selectedMcqs = shuffledMcqs.slice(0, mcqCount).map(q => ({ ...q, type: 'mcq' }));

    const shuffledFibs = [...fibPool].sort(() => 0.5 - Math.random());
    const selectedFibs = shuffledFibs.slice(0, fibCount).map(q => ({ question: q, type: 'fib' }));

    // Combine
    let combined = [...selectedMcqs, ...selectedFibs];
    setQuestions(combined);
    setIsSaved(false);
  };

  const shuffleQuestions = () => {
    setQuestions(prev => [...prev].sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleSave = () => {
    // Create new training object
    const newTraining = {
      id: Date.now(),
      title: title,
      type: contentType,
      thumbnail: contentType === 'youtube' ? "https://img.youtube.com/vi/8Jv47_VIBOQ/maxresdefault.jpg" : null,
      duration: contentType === 'youtube' ? "20 mins" : "12 pages",
      candidates: 0,
      status: "Active",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      questions: questions
    };

    // Save to localStorage
    const existingTrainings = JSON.parse(localStorage.getItem('training_modules') || '[]');
    localStorage.setItem('training_modules', JSON.stringify([newTraining, ...existingTrainings]));

    setIsSaved(true);
    setTimeout(() => {
      navigate('/admin/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={generateQuestions}
              className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </button>
            <button
              onClick={shuffleQuestions}
              className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle Order
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Generated Test Preview</h1>
              <p className="text-slate-500 mt-1">
                Based on configuration: {config.mcq}% MCQs, {config.fib}% Fill in the Blanks
              </p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold">
              Total Questions: {questions.length}
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-500 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-500 flex-shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                        q.type === 'mcq' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {q.type === 'mcq' ? 'Multiple Choice' : 'Fill in Blank'}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-slate-900 mb-4">{q.question}</p>
                    
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex items-center p-3 bg-white rounded-lg border border-slate-200 text-slate-700">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 mr-3"></div>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {q.type === 'fib' && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 border-dashed text-slate-400 italic">
                        Answer will be input here...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end sticky bottom-8">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
              isSaved 
                ? 'bg-emerald-600 text-white cursor-default' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-6 h-6 mr-2" />
                Module Saved!
              </>
            ) : (
              <>
                <Save className="w-6 h-6 mr-2" />
                Approve & Save Module
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedTest;
