import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './layouts/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import NewApplicationPage from './pages/NewApplicationPage/NewApplicationPage';
import LoanOfficerDashboard from './pages/LoanOfficerDashboard/LoanOfficerDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Auth from './components/auth/Auth';
import Profile from './pages/Profile/Profile';
import LoanOfficerReview from './pages/LoanOfficerReview/LoanOfficerReview';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/applications" element={<NewApplicationPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer-dashboard"
          element={
            <ProtectedRoute>
              <LoanOfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer-review"
          element={
            <ProtectedRoute>
              <LoanOfficerReview />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
