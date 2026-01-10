import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import GeneratedTest from './pages/admin/GeneratedTest';

import CandidateLogin from './pages/candidate/CandidateLogin';
import CandidateDashboard from './pages/candidate/CandidateDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/test-preview" element={<GeneratedTest />} />
        
        {/* Candidate Routes */}
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
