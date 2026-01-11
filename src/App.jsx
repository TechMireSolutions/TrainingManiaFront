import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import GeneratedTest from './pages/admin/GeneratedTest';
import TrainingDetails from './pages/admin/TrainingDetails';

import CandidateLogin from './pages/candidate/CandidateLogin';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import TakeQuiz from './pages/candidate/TakeQuiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/test-preview" element={<GeneratedTest />} />
        <Route path="/admin/training/:id" element={<TrainingDetails />} />

        {/* Candidate Routes */}
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/take-test/:id" element={<TakeQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
