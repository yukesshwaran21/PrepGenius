import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import InterviewResults from './pages/InterviewResults';
import InterviewHistory from './pages/InterviewHistory';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/resume-analyzer"
          element={
            <PrivateRoute>
              <ResumeUpload />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview-setup"
          element={
            <PrivateRoute>
              <InterviewSetup />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview-session"
          element={
            <PrivateRoute>
              <InterviewSession />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview-results"
          element={
            <PrivateRoute>
              <InterviewResults />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview-history"
          element={
            <PrivateRoute>
              <InterviewHistory />
            </PrivateRoute>
          }
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
