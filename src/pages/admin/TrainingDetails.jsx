import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, Youtube, FileText, CheckCircle } from 'lucide-react';

const TrainingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const modules = JSON.parse(localStorage.getItem('training_modules') || '[]');
        const found = modules.find(m => m.id.toString() === id);
        if (found) {
            setTraining(found);
        } else {
            alert('Training module not found');
            navigate('/admin/dashboard');
        }
        setIsLoading(false);
    }, [id, navigate]);

    const handleSave = () => {
        setIsSaving(true);
        const modules = JSON.parse(localStorage.getItem('training_modules') || '[]');
        const updatedModules = modules.map(m => m.id.toString() === id ? training : m);
        localStorage.setItem('training_modules', JSON.stringify(updatedModules));

        setTimeout(() => {
            setIsSaving(false);
            alert('Changes saved successfully!');
        }, 800);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...training.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setTraining({ ...training, questions: updatedQuestions });
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!training) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-70"
                    >
                        {isSaving ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {/* content */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Training Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={training.title}
                                    onChange={(e) => setTraining({ ...training, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {training.type === 'youtube' ? 'Video URL' : 'PDF Document'}
                                </label>
                                {training.type === 'youtube' ? (
                                    <input
                                        type="text"
                                        value={training.videoUrl || ''}
                                        onChange={(e) => setTraining({ ...training, videoUrl: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none"
                                    />
                                ) : (
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 italic">
                                        PDF re-upload not supported in this version.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rules & Scoring Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Total Marks</label>
                                <input
                                    type="number"
                                    value={training.totalMarks || ''}
                                    onChange={(e) => setTraining({ ...training, totalMarks: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Passing Marks</label>
                                <input
                                    type="number"
                                    value={training.passingMarks || ''}
                                    onChange={(e) => setTraining({ ...training, passingMarks: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Allowed Attempts</label>
                                <input
                                    type="number"
                                    value={training.attempts || 1}
                                    onChange={(e) => setTraining({ ...training, attempts: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Test Duration (Mins)</label>
                                <input
                                    type="number"
                                    value={training.testDuration || 20}
                                    onChange={(e) => setTraining({ ...training, testDuration: parseInt(e.target.value) || 20 })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Total Questions to Show</label>
                                <input
                                    type="number"
                                    value={training.totalQuestions || training.questions?.length || 20}
                                    onChange={(e) => setTraining({ ...training, totalQuestions: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                                <p className="text-xs text-slate-400 mt-1">Limit the number of questions displayed in the quiz.</p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={training.negativeMarking || false}
                                    onChange={(e) => setTraining({ ...training, negativeMarking: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                />
                                <span className="ml-3 text-sm font-bold text-slate-900">Enable Negative Marking</span>
                            </div>

                            {training.negativeMarking && (
                                <div className="flex items-center">
                                    <span className="text-sm text-slate-500 mr-3">Deduct per wrong answer:</span>
                                    <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-slate-200 w-24">
                                        <input
                                            type="number"
                                            step="0.25"
                                            value={training.negativeMarkingValue || 0}
                                            onChange={(e) => setTraining({ ...training, negativeMarkingValue: parseFloat(e.target.value) })}
                                            className="w-full outline-none font-bold text-red-500 bg-transparent"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assessment Questions */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                            <span>Assessment Questions</span>
                            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                {training.questions?.length || 0} Questions
                            </span>
                        </h2>

                        <div className="space-y-6">
                            {training.questions && training.questions.map((q, index) => (
                                <div key={index} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${q.type === 'mcq' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {q.type === 'mcq' ? 'Multiple Choice' : 'Fill in Blank'}
                                        </span>
                                        <button
                                            onClick={() => {
                                                const newQuestions = training.questions.filter((_, i) => i !== index);
                                                setTraining({ ...training, questions: newQuestions });
                                            }}
                                            className="text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={q.question}
                                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-indigo-500 outline-none font-medium"
                                        />

                                        {q.type === 'mcq' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-slate-200">
                                                {q.options.map((opt, optIndex) => (
                                                    <div key={optIndex} className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-slate-300 mr-2"></div>
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const newOptions = [...q.options];
                                                                newOptions[optIndex] = e.target.value;
                                                                handleQuestionChange(index, 'options', newOptions);
                                                            }}
                                                            className="w-full px-2 py-1 bg-transparent border-b border-transparent focus:border-indigo-300 outline-none text-sm text-slate-600"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {(!training.questions || training.questions.length === 0) && (
                                <div className="text-center py-8 text-slate-400">
                                    No questions generated for this module.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingDetails;
