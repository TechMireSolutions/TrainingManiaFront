import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, BookOpen, PlayCircle, CheckCircle, Clock, FileText } from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('my-courses');
  const [myCourses, setMyCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);

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
          thumbnail: trainingDetails?.thumbnail || ''
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
                    onClick={() => console.log('Navigate to quiz')}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Attempt Quiz
                  </button>
                </div>
              </div>

              {/* Video Summary Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Video Summary</h3>
                  </div>
                  
                  <div className="prose prose-slate prose-sm text-slate-600 space-y-4">
                    <p>
                      This training module covers the essential concepts required for your role. Key takeaways include:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Understanding the core principles and best practices.</li>
                      <li>Step-by-step guide to implementing the discussed strategies.</li>
                      <li>Analyzing real-world examples to reinforce learning.</li>
                      <li>Common challenges and how to overcome them effectively.</li>
                    </ul>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-6">
                      <h4 className="font-semibold text-slate-900 mb-1 text-xs uppercase tracking-wider">Key Insight</h4>
                      <p className="text-sm italic">
                        "Success in this module depends on consistent practice and application of these fundamental rules."
                      </p>
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
