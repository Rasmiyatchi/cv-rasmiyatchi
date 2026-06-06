/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AppBackground } from './components/AppBackground';

// Sahifalar talab bo'yicha yuklanadi (code-splitting) — boshlang'ich yuklama kichik bo'ladi.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Experience = lazy(() => import('./pages/Experience'));
const Projects = lazy(() => import('./pages/Projects'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Publications = lazy(() => import('./pages/Publications'));
const Contact = lazy(() => import('./pages/Contact'));
const CV = lazy(() => import('./pages/CV'));

const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements'));
const AdminPublications = lazy(() => import('./pages/admin/AdminPublications'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-blue-600/30 border-t-blue-600" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppBackground />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="experience" element={<Experience />} />
              <Route path="projects" element={<Projects />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="publications" element={<Publications />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* CV / Resume (standalone, chop etish uchun) */}
            <Route path="/cv" element={<CV />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="publications" element={<AdminPublications />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="about" element={<AdminAbout />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}
