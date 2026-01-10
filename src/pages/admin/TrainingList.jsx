import React from 'react';
import { 
  MoreVertical, 
  Youtube, 
  FileText, 
  Clock, 
  Users, 
  PlayCircle,
  Edit,
  Trash2
} from 'lucide-react';

const TrainingList = () => {
  // Mock Data
  const initialTrainings = [
    {
      id: 1,
      title: "WordPress Fundamentals",
      type: "youtube",
      thumbnail: "https://img.youtube.com/vi/8Jv47_VIBOQ/maxresdefault.jpg", // Placeholder
      duration: "45 mins",
      candidates: 128,
      status: "Active",
      date: "Jan 10, 2026"
    },
    {
      id: 2,
      title: "Cyber Security Basics",
      type: "pdf",
      thumbnail: null,
      duration: "15 pages",
      candidates: 85,
      status: "Active",
      date: "Jan 08, 2026"
    },
    {
      id: 3,
      title: "Advanced React Patterns",
      type: "youtube",
      thumbnail: null,
      duration: "1.5 hours",
      candidates: 42,
      status: "Draft",
      date: "Jan 05, 2026"
    }
  ];

  const [trainings, setTrainings] = React.useState(initialTrainings);

  React.useEffect(() => {
    const savedTrainings = JSON.parse(localStorage.getItem('training_modules') || '[]');
    if (savedTrainings.length > 0) {
      setTrainings([...savedTrainings, ...initialTrainings]);
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this training module?')) {
      // Update state
      const updatedTrainings = trainings.filter(t => t.id !== id);
      setTrainings(updatedTrainings);

      // Update localStorage (only affects new trainings that are saved there)
      const savedTrainings = JSON.parse(localStorage.getItem('training_modules') || '[]');
      const newSavedTrainings = savedTrainings.filter(t => t.id !== id);
      localStorage.setItem('training_modules', JSON.stringify(newSavedTrainings));
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Training Modules</h2>
          <p className="text-slate-500">Manage your existing courses and assessments.</p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <div key={training.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
            {/* Thumbnail Area */}
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {training.type === 'youtube' ? (
                training.thumbnail && !training.thumbnail.includes('null') ? (
                  <img src={training.thumbnail} alt={training.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                    <Youtube className="w-16 h-16 text-indigo-200" />
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50">
                  <FileText className="w-16 h-16 text-orange-200" />
                </div>
              )}
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                {training.status}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${training.type === 'youtube' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                  {training.type === 'youtube' ? <Youtube className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{training.title}</h3>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {training.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1.5" />
                  {training.candidates}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <button className="flex-1 flex items-center justify-center py-2 rounded-lg bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 transition-colors text-sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(training.id)}
                  className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingList;
