import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { OAuthCallbackPage } from './pages/auth/OAuthCallbackPage';

// Public pages
import { LandingPage } from './pages/LandingPage';
import { PortfolioPage } from './pages/portfolio/PortfolioPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Dashboard
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { PersonalInfoPage } from './pages/dashboard/PersonalInfoPage';
import { SummaryPage } from './pages/dashboard/SummaryPage';
import { ExperiencePage } from './pages/dashboard/ExperiencePage';
import { EducationPage } from './pages/dashboard/EducationPage';
import { SkillsPage } from './pages/dashboard/SkillsPage';
import { CertificationsPage } from './pages/dashboard/CertificationsPage';
import { ProjectsPage } from './pages/dashboard/ProjectsPage';
import { AwardsPage } from './pages/dashboard/AwardsPage';
import { LanguagesPage } from './pages/dashboard/LanguagesPage';

// Auth guard
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => (
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
      <Route path="/portfolio/:username" element={<PortfolioPage />} />

      {/* Protected dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="personal-info" element={<PersonalInfoPage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="awards" element={<AwardsPage />} />
          <Route path="languages" element={<LanguagesPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
