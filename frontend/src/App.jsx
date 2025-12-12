import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PaymentPage from './components/PaymentPage';
import ContactPage from './components/ContactPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import LegalPage from './components/LegalPage';
import LegalPage from './components/LegalPage';
import DownloadDesktopPage from './components/DownloadDesktopPage';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/payment" element={<PaymentPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
        <Route path="/download/desktop" element={<DownloadDesktopPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
