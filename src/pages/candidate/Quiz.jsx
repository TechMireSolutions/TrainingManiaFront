import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowRight, Clock } from "lucide-react";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!course) {
      navigate("/candidate/dashboard");
      return;
    }
    // Set timer based on course settings or default to 20 mins
    setTimeLeft((course.testDuration || 20) * 60);
  }, [course, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleFibChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    let calculatedScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    course.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) {
        skippedCount++;
      } else if (
        (q.type === "mcq" && userAnswer === q.correctAnswer) ||
        (q.type === "fib" &&
          userAnswer.toLowerCase().trim() ===
            q.correctAnswer.toLowerCase().trim())
      ) {
        calculatedScore += 1; // Assuming 1 mark per question for simplicity, or use q.marks
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    // Calculate percentage based on total questions
    const totalQuestions = course.questions.length;
    const finalScore = Math.round((correctCount / totalQuestions) * 100);

    setScore(finalScore);
    setIsSubmitted(true);

    // Save Result
    const result = {
      id: Date.now(),
      candidate: JSON.parse(localStorage.getItem("current_candidate"))?.email,
      training: course.title, // Use title from course object
      score: finalScore,
      totalMarks: 100,
      correct: correctCount,
      wrong: wrongCount,
      skipped: skippedCount,
      status: finalScore >= (course.passingMarks || 40) ? "Passed" : "Failed",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const existingResults = JSON.parse(
      localStorage.getItem("test_results") || "[]"
    );
    localStorage.setItem(
      "test_results",
      JSON.stringify([result, ...existingResults])
    );
  };

  if (!course) return null;

  const currentQuestion = course.questions[currentQuestionIndex];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              score >= (course.passingMarks || 40)
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {score >= (course.passingMarks || 40) ? (
              <CheckCircle className="w-10 h-10" />
            ) : (
              <AlertCircle className="w-10 h-10" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {score >= (course.passingMarks || 40)
              ? "Congratulations!"
              : "Assessment Failed"}
          </h2>
          <p className="text-slate-500 mb-8">
            You have scored{" "}
            <span className="font-bold text-slate-900">{score}%</span> in this
            assessment.
          </p>
          <button
            onClick={() => navigate("/candidate/dashboard")}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900 truncate max-w-xs">
            {course.title}
          </h1>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold ${
              timeLeft < 60
                ? "bg-red-50 text-red-600"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {course.questions.length}
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                currentQuestion.type === "mcq"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {currentQuestion.type === "mcq"
                ? "Multiple Choice"
                : "Fill in Blank"}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="flex-1">
            {currentQuestion.type === "mcq" ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleOptionSelect(currentQuestion.id, option)
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[currentQuestion.id] === option
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                        : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[currentQuestion.id] === option
                            ? "border-indigo-600"
                            : "border-slate-300"
                        }`}
                      >
                        {answers[currentQuestion.id] === option && (
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleFibChange(currentQuestion.id, e.target.value)
                  }
                  placeholder="Type your answer here..."
                  className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-0 outline-none transition-all text-lg"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-100">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 text-slate-500 font-bold hover:text-slate-900 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
            >
              Previous
            </button>

            {currentQuestionIndex === course.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(course.questions.length - 1, prev + 1)
                  )
                }
                className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
