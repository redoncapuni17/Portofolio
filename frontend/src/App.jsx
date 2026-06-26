import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './hooks/useAuth'
import PublicLayout from './components/layout/PublicLayout'
import PageLoader from './components/ui/PageLoader'

// Public pages — lazy loaded per route
const HomePage = lazy(() => import('./pages/Home'))
const AboutPage = lazy(() => import('./pages/About'))
const ExperiencePage = lazy(() => import('./pages/Experience'))
const SkillsPage = lazy(() => import('./pages/Skills'))
const ProjectsPage = lazy(() => import('./pages/Projects'))
const CertificationsPage = lazy(() => import('./pages/Certifications'))
const EducationPage = lazy(() => import('./pages/Education'))
const ContactPage = lazy(() => import('./pages/Contact'))

// Admin pages — lazy loaded (keeps recharts/heavy admin code off the public bundle)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProfile = lazy(() => import('./pages/admin/Profile'))
const AdminExperiences = lazy(() => import('./pages/admin/Experiences'))
const AdminEducation = lazy(() => import('./pages/admin/Education'))
const AdminSkills = lazy(() => import('./pages/admin/Skills'))
const AdminProjects = lazy(() => import('./pages/admin/Projects'))
const AdminCertifications = lazy(() => import('./pages/admin/Certifications'))
const AdminMessages = lazy(() => import('./pages/admin/Messages'))
const AdminSocialLinks = lazy(() => import('./pages/admin/SocialLinks'))
const AdminSEO = lazy(() => import('./pages/admin/SEO'))

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
