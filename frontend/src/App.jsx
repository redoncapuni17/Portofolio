import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './hooks/useAuth'

// Public pages
import PublicLayout from './components/layout/PublicLayout'
import HomePage from './pages/Home'
import AboutPage from './pages/About'
import ExperiencePage from './pages/Experience'
import SkillsPage from './pages/Skills'
import ProjectsPage from './pages/Projects'
import CertificationsPage from './pages/Certifications'
import EducationPage from './pages/Education'
import ContactPage from './pages/Contact'

// Admin pages
import AdminLayout from './components/layout/AdminLayout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProfile from './pages/admin/Profile'
import AdminExperiences from './pages/admin/Experiences'
import AdminEducation from './pages/admin/Education'
import AdminSkills from './pages/admin/Skills'
import AdminProjects from './pages/admin/Projects'
import AdminCertifications from './pages/admin/Certifications'
import AdminMessages from './pages/admin/Messages'
import AdminSocialLinks from './pages/admin/SocialLinks'
import AdminSEO from './pages/admin/SEO'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          theme="dark"
          toastOptions={{
            style: {
              background: '#1c1c1f',
              border: '1px solid #2a2a2f',
              color: '#fafafa',
            }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="certifications" element={<CertificationsPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="experiences" element={<AdminExperiences />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="social-links" element={<AdminSocialLinks />} />
            <Route path="seo" element={<AdminSEO />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
