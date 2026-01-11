import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, BookOpen, PlayCircle, CheckCircle, Clock, FileText, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('my-courses');
  const [myCourses, setMyCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);

  // AI Agent State
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI learning assistant. As you watch the video, feel free to ask me anything about the content. I am here to help you understand!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg = { role: 'user', text: inputMessage };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "That's a great question! Based on the video content, try to focus on the key principles mentioned around the middle section. Let me know if you need more specific details."
      }]);
    }, 1000);
  };

  useEffect(() => {
    const stored = localStorage.getItem('current_candidate');
    if (!stored) {
      navigate('/candidate/login');
      return;
    }
    const candidateData = JSON.parse(stored);
    setCandidate(candidateData);

    // Load Enrollments & Link with Training Details
    const allEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    const allTrainings = JSON.parse(localStorage.getItem('training_modules') || '[]');

    const candidateCourses = allEnrollments
      .filter(enrollment => enrollment.candidate === candidateData.email)
      .map(enrollment => {
        // Find full training details to get videoUrl
        const trainingDetails = allTrainings.find(t => t.title === enrollment.training);
        return {
          ...enrollment,
          videoUrl: trainingDetails?.videoUrl || '',
          videoUrl: trainingDetails?.videoUrl || '',
          thumbnail: trainingDetails?.thumbnail || '',
          trainingId: trainingDetails?.id
        };
      });

    setMyCourses(candidateCourses);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('current_candidate');
    navigate('/candidate/login');
  };

  const handleStartLearning = (course) => {
    setCurrentCourse(course);
    setActiveTab('player');
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : '';
    return `https://www.youtube.com/embed/${id}`;
  };

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Training</h1>
              <span className="text-indigo-600 font-semibold text-xs">Mania</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                {candidate.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{candidate.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'my-courses' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
              <p className="text-slate-500">Access your assigned training modules.</p>
            </div>

            {myCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
                    <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.training} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                      )}
                      <PlayCircle className="w-12 h-12 text-indigo-600 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 absolute" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wide">
                          {course.status}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{course.training}</h3>
                      <button
                        onClick={() => handleStartLearning(course)}
                        className="w-full mt-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Start Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Courses Assigned</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  You haven't been enrolled in any training modules yet. Please contact your administrator.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'player' && currentCourse && (
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setActiveTab('my-courses')}
              className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
            >
              <LayoutDashboard className="w-4 h-4 mr-2 rotate-180" />
              Back to Courses
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Video Player Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                  <div className="aspect-video w-full bg-black">
                    {currentCourse.videoUrl ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={getYoutubeEmbedUrl(currentCourse.videoUrl)}
                        title={currentCourse.training}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <p>No video available for this course.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentCourse.training}</h1>
                  <p className="text-slate-500 mb-6">
                    Watch the video carefully. You will need to complete the assessment after this.
                  </p>

                  <button
                    onClick={() => navigate(`/candidate/take-test/${currentCourse.trainingId}`)}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Attempt Quiz
                  </button>
                </div>
              </div>

              {/* AI Agent Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] sticky top-24">

                  {/* AI Header */}
                  <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">AI Learning Assistant</h3>
                      <p className="text-xs text-slate-500">Ask doubts while watching</p>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a question..."
                        className="flex-1 px-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl text-sm transition-all outline-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateDashboard;
