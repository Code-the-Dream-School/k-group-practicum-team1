import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './layouts/Footer/Footer';

import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
