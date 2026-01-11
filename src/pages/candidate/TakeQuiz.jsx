import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle, AlertTriangle, Clock, HelpCircle, Save } from 'lucide-react';

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [training, setTraining] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(1200);
    const [result, setResult] = useState(null);

    // AI Agent State
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I am your AI assistant. I can help you clarify questions or concepts if you get stuck. I cannot give you direct answers though! Good luck.' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [showTimeoutScreen, setShowTimeoutScreen] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);

    useEffect(() => {
        const allTrainings = JSON.parse(localStorage.getItem('training_modules') || '[]');
        const found = allTrainings.find(t => t.id.toString() === id);

        if (!found) {
            alert('Training module not found');
            navigate('/candidate/dashboard');
            return;
        }

        setTraining(found);

        // Set Duration from config (in seconds)
        if (found.testDuration) {
            setTimeLeft(found.testDuration * 60);
        } else {
            setTimeLeft(20 * 60); // Default 20 mins
        }

        // Respect Total Questions Limit
        const limit = found.totalQuestions || found.questions.length;
        const boundedQuestions = found.questions.slice(0, limit);
        setTraining({ ...found, questions: boundedQuestions });

        // Handle Review Mode
        if (location.state && location.state.mode === 'review' && location.state.answers) {
            setAnswers(location.state.answers);

            // Calculate result immediately for review display context if needed, 
            // though we mainly just want to show the review screen.
            // We can force result state to bypass timer logic.
            // But we need the questions to match the answers.
            setIsReviewing(true);
            // Create a dummy result to stop the timer
            setResult({ isPassed: true, obtainedMarks: 0, totalMarks: 0, correctCount: 0, incorrectCount: 0 });
        }

    }, [id, navigate, location.state]);

    // Timer Logic
    useEffect(() => {
        if (!training || result) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [training, result]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const calculateResult = () => {
        let obtainedMarks = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let attemptedCount = 0;

        const { questions, totalMarks = 100, passingMarks = 40, negativeMarking, negativeMarkingValue = 0 } = training;
        const marksPerQuestion = totalMarks / questions.length;

        questions.forEach((q, index) => {
            const userAnswer = answers[index];
            if (userAnswer) {
                attemptedCount++;
                const correctValue = q.correctAnswer || q.answer;
                const isCorrect = userAnswer.toString().toLowerCase().trim() === (correctValue || '').toString().toLowerCase().trim();

                if (isCorrect) {
                    obtainedMarks += marksPerQuestion;
                    correctCount++;
                } else {
                    incorrectCount++;
                    if (negativeMarking) {
                        obtainedMarks -= negativeMarkingValue;
                    }
                }
            }
        });

        const percentage = (obtainedMarks / totalMarks) * 100;
        const isPassed = obtainedMarks >= passingMarks;

        return {
            obtainedMarks: Math.max(0, obtainedMarks),
            totalMarks,
            percentage,
            isPassed,
            correctCount,
            incorrectCount,
            attemptedCount,
            totalQuestions: questions.length
        };
    };

    const handleSubmit = (auto = false) => {
        if (!auto && !window.confirm('Are you sure you want to submit the quiz?')) return;

        // setIsSubmitting(true); // Assuming setIsSubmitting is defined elsewhere or removed
        const results = calculateResult();
        setResult(results);

        if (auto) {
            setShowTimeoutScreen(true);
        }

        const allEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const candidate = JSON.parse(localStorage.getItem('current_candidate'));

        const updatedEnrollments = allEnrollments.map(e => {
            if (e.candidate === candidate.email && e.training === training.title) {
                return {
                    ...e,
                    status: results.isPassed ? 'Completed' : 'Failed',
                    score: results.obtainedMarks,
                    attempts: (e.attempts || 0) + 1,
                    lastAttemptDate: new Date().toLocaleDateString(),
                    userAnswers: answers // Save user answers for review
                };
            }
            return e;
        });

        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
    };

    if (!training) return <div>Loading...</div>;

    if (showTimeoutScreen) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Time's Up!</h2>
                    <p className="text-slate-500 mb-8">
                        The allotted time for this test has expired. Your progress has been automatically saved and submitted.
                    </p>
                    <button
                        onClick={() => setShowTimeoutScreen(false)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-lg shadow-lg shadow-indigo-200"
                    >
                        View Results
                    </button>
                </div>
            </div>
        );
    }

    if (result) {
        if (isReviewing) {
            return (
                <div className="min-h-screen bg-slate-50 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">Answer Review</h1>
                            <button
                                onClick={() => setIsReviewing(false)}
                                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                            >
                                Back to Results
                            </button>
                        </div>

                        <div className="space-y-6">
                            {training.questions.map((q, index) => {
                                const userAnswer = answers[index];
                                const correctValue = q.correctAnswer || q.answer;
                                const isCorrect = userAnswer?.toString().toLowerCase().trim() === correctValue?.toString().toLowerCase().trim();

                                return (
                                    <div key={index} className={`p-6 rounded-xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-slate-900 mb-4">{q.question}</h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Your Answer</span>
                                                        <div className={`p-3 rounded-lg font-medium ${isCorrect ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'}`}>
                                                            {userAnswer || <span className="italic text-slate-400">Skipped</span>}
                                                        </div>
                                                    </div>
                                                    {!isCorrect && (
                                                        <div>
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Correct Answer</span>
                                                            <div className="p-3 rounded-lg font-medium text-emerald-700 bg-emerald-100">
                                                                {correctValue}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result.isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {result.isPassed ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {result.isPassed ? 'Congratulations! Passed' : 'Assessment Failed'}
                    </h2>
                    <div className="text-5xl font-bold text-indigo-600 mb-2">{result.obtainedMarks.toFixed(1)}</div>
                    <p className="text-slate-500 mb-8">out of {result.totalMarks} marks</p>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <span className="block text-slate-500">Correct</span>
                            <span className="font-bold text-emerald-600">{result.correctCount}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <span className="block text-slate-500">Incorrect</span>
                            <span className="font-bold text-red-600">{result.incorrectCount}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {result.isPassed && (
                            <button
                                onClick={() => navigate(`/candidate/certificate/${training.id}`)}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Get Certificate
                            </button>
                        )}

                        <button
                            onClick={() => setIsReviewing(true)}
                            className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all"
                        >
                            Review Answers
                        </button>

                        <button
                            onClick={() => navigate('/candidate/dashboard')}
                            className="w-full py-3 text-slate-400 hover:text-slate-600 font-medium transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = training.questions[currentQuestionIndex];
    const allQuestionsAnswered = Object.keys(answers).length === training.questions.length;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white px-8 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 transition-all">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">{training.title}</h1>
                    <p className="text-slate-500 text-sm">Question {currentQuestionIndex + 1} of {training.questions.length}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center px-4 py-2 rounded-lg font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-700'}`}>
                        <Clock className="w-5 h-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>

                    {allQuestionsAnswered && (
                        <button
                            onClick={() => handleSubmit(false)}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 animate-fade-in"
                        >
                            Submit Test
                        </button>
                    )}
                </div>
            </header>

            {/* Question Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col">
                    <h2 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
                        {currentQ.question}
                    </h2>

                    <div className="flex-1">
                        {currentQ.type === 'mcq' ? (
                            <div className="space-y-4">
                                {currentQ.options.map((opt, i) => (
                                    <label key={i} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQuestionIndex] === opt ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}>
                                        <input
                                            type="radio"
                                            name={`q-${currentQuestionIndex}`}
                                            value={opt}
                                            checked={answers[currentQuestionIndex] === opt}
                                            onChange={() => handleAnswer(currentQuestionIndex, opt)}
                                            className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                        />
                                        <span className={`ml-4 text-base ${answers[currentQuestionIndex] === opt ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={answers[currentQuestionIndex] || ''}
                                    onChange={(e) => handleAnswer(currentQuestionIndex, e.target.value)}
                                    className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none"
                                    placeholder="Type your answer here..."
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(training.questions.length - 1, prev + 1))}
                            disabled={currentQuestionIndex === training.questions.length - 1}
                            className="px-6 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz;
