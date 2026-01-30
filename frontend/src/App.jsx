import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './layouts/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import NewApplicationPage from './pages/NewApplicationPage/NewApplicationPage';
import LoanOfficerDashboard from './pages/LoanOfficerDashboard/LoanOfficerDashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/application" element={<NewApplicationPage />} />
        <Route path="/officer-dashboard" element={<LoanOfficerDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
